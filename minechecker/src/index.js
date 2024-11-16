import 'dotenv/config'

import * as fs from "fs"
import * as path from "path"

import { Authflow } from 'prismarine-auth'
import { RealmAPI } from 'prismarine-realms'

import { ping } from 'bedrock-protocol'

const { CACHE_DIR, REALM_NAME, BACKUP_DIR } = process.env

const PING_INTERVAL = parseInt(process.env.PING_INTERVAL)
const BACKUP_INTERVAL = parseInt(process.env.BACKUP_INTERVAL)
const LOOP_RESOLUTION = parseInt(process.env.LOOP_RESOLUTION)

let lastBackupStored;

function formatBackupFilename(backup) {
  const time = backup.lastModifiedDate
  const date = new Date(time);
  const humanDate = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`

  return `${backup.metadata.name}-${time}-${humanDate}.mcworld`
}

function getLastBackupStored() {
  const backupsStored = fs.readdirSync(path.join('.', BACKUP_DIR))

  if (backupsStored && backupsStored.length) {
    const latestStored = backupsStored.slice(-1);
    lastBackupStored = latestStored
  }
}

async function downloadBackup(backup) {
  const download = await backup.getDownload()
  const buffer = await download.getBuffer();

  const filename = formatBackupFilename(backup);

  console.log(`💾 Downloading ${filename}`);

  fs.writeFileSync(path.join('.', BACKUP_DIR, filename), buffer)

  lastBackupStored = filename
}

async function backupRealm(realm) {
  const [latestBackup] = await realm.getBackups()

  if (lastBackupStored === formatBackupFilename(latestBackup)) {
    console.log(`Most recent backup already stored: ${lastBackupStored}`);
    return
  }

  await downloadBackup(latestBackup)
}

async function handleMsLogin(res) {
  console.log(res);
}

async function authRealm() {
  console.log('🏰 Authing realm...');

  const authflow = new Authflow(undefined, CACHE_DIR, undefined, handleMsLogin)
  const api = RealmAPI.from(authflow, 'bedrock')
  const realms = await api.getRealms()
  const realm = realms.find(r => r.name === REALM_NAME)
  const address = await realm.getAddress()

  return { realm, address }
}

async function pingRealm(address) {
  const advertisment = await ping({ host: address.host, port: address.port })
  return advertisment
}

async function checkPlayers(address) {
  const advertisment = await pingRealm(address)
  console.log(advertisment);
}

getLastBackupStored()
const { realm, address } = await authRealm()

let lastBackupTime = 0;
let backupRunning = false

let lastPingTime = 0;
let pingRunning = false

setInterval(async () => {
  const now = Date.now()
  const sinceLastBackup = now - lastBackupTime

  if (sinceLastBackup > BACKUP_INTERVAL && !backupRunning) {
    console.log('backing up...');

    new Promise(async (resolve) => {
      backupRunning = true;
      await backupRealm(realm)
      backupRunning = false;
      lastBackupTime = now
      resolve();
    })
  }

  const sinceLastPing = now - lastPingTime

  if (sinceLastPing > PING_INTERVAL && !pingRunning) {
    console.log('pinging...');

    new Promise(async (resolve) => {
      pingRunning = true;
      await checkPlayers(address)
      pingRunning = false;

      lastPingTime = now
      resolve();
    })
  }
}, LOOP_RESOLUTION);