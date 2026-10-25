const REGISTERED_USERS_KEY = 'skillbridge-registered-users'
const SESSION_USER_KEY = 'skillbridge-current-user'
const SAVED_ADDRESSES_KEY = 'skillbridge-saved-addresses'
const PASSWORD_ITERATIONS = 210000

function getAddressOwner(user) {
  return user?.id ?? user?.email?.trim().toLowerCase() ?? 'guest'
}

function readSavedAddresses() {
  const storedAddresses = window.localStorage.getItem(SAVED_ADDRESSES_KEY)
  if (!storedAddresses) return []

  try {
    const addresses = JSON.parse(storedAddresses)
    if (!Array.isArray(addresses)) {
      throw new Error('Saved address data has an invalid format.')
    }
    return addresses
  } catch (error) {
    console.error('Saved delivery address data in browser storage is invalid.', error)
    throw new Error('Saved address data could not be read. Clear the app storage and try again.')
  }
}

function writeSavedAddresses(addresses) {
  try {
    window.localStorage.setItem(
      SAVED_ADDRESSES_KEY,
      JSON.stringify(addresses),
    )
  } catch (error) {
    console.error('Unable to save delivery addresses.', error)
    throw new Error('Your address could not be saved in this browser. Check storage settings and try again.')
  }
}

function makeAddressId(ownerId, address) {
  return `${ownerId}:${address.postalCode}:${address.address}`
}

export function getSavedAddresses(user) {
  const ownerId = getAddressOwner(user)
  const entries = readSavedAddresses()
    .filter(
      (entry) =>
        entry.ownerId === ownerId &&
        typeof entry.savedAt === 'string' &&
        entry.address,
    )
    .sort((first, second) => second.savedAt.localeCompare(first.savedAt))
  const hasExplicitDefault = entries.some((entry) => entry.isDefault)

  return entries.map((entry, index) => ({
    ...entry.address,
    id: entry.id ?? makeAddressId(ownerId, entry.address),
    isDefault: hasExplicitDefault ? Boolean(entry.isDefault) : index === 0,
  }))
}

export function getLatestSavedAddress(user) {
  const addresses = getSavedAddresses(user)
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null
}

export function saveDeliveryAddress(user, address) {
  const ownerId = getAddressOwner(user)
  const addresses = readSavedAddresses()
  const existingOwnerEntries = addresses
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.ownerId === ownerId)
    .sort((first, second) =>
      second.entry.savedAt.localeCompare(first.entry.savedAt),
    )

  if (
    existingOwnerEntries.length &&
    !existingOwnerEntries.some(({ entry }) => entry.isDefault)
  ) {
    const mostRecentEntry = existingOwnerEntries[0]
    addresses[mostRecentEntry.index] = {
      ...mostRecentEntry.entry,
      id:
        mostRecentEntry.entry.id ??
        makeAddressId(ownerId, mostRecentEntry.entry.address),
      isDefault: true,
    }
  }

  const normalizedAddress = {
    fullName: address.fullName.trim(),
    phone: address.phone.trim(),
    email: address.email.trim().toLowerCase(),
    address: address.address.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
  }
  const duplicateIndex = addresses.findIndex(
    (entry) =>
      entry.ownerId === ownerId &&
      entry.address.address.trim().toLowerCase() ===
        normalizedAddress.address.toLowerCase() &&
      entry.address.postalCode === normalizedAddress.postalCode,
  )
  const ownerAddresses = addresses.filter(
    (entry) => entry.ownerId === ownerId,
  )
  const existingEntry = duplicateIndex < 0 ? null : addresses[duplicateIndex]
  const savedEntry = {
    id: existingEntry?.id ?? makeAddressId(ownerId, normalizedAddress),
    ownerId,
    address: normalizedAddress,
    savedAt: new Date().toISOString(),
    isDefault: existingEntry?.isDefault ?? ownerAddresses.length === 0,
  }
  const updatedAddresses =
    duplicateIndex < 0
      ? [...addresses, savedEntry]
      : addresses.map((entry, index) =>
          index === duplicateIndex ? savedEntry : entry,
        )

  writeSavedAddresses(updatedAddresses)

  return normalizedAddress
}

export function updateSavedAddress(user, addressId, address) {
  const ownerId = getAddressOwner(user)
  const addresses = readSavedAddresses()
  const index = addresses.findIndex(
    (entry) =>
      entry.ownerId === ownerId &&
      (entry.id ?? makeAddressId(ownerId, entry.address)) === addressId,
  )

  if (index < 0) {
    throw new Error('This saved address could not be found. Refresh and try again.')
  }

  const normalizedAddress = {
    fullName: address.fullName.trim(),
    phone: address.phone.trim(),
    email: address.email.trim().toLowerCase(),
    address: address.address.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
  }
  const isDuplicate = addresses.some(
    (entry, entryIndex) =>
      entryIndex !== index &&
      entry.ownerId === ownerId &&
      entry.address.address.trim().toLowerCase() ===
        normalizedAddress.address.toLowerCase() &&
      entry.address.postalCode === normalizedAddress.postalCode,
  )

  if (isDuplicate) {
    throw new Error('This address is already saved.')
  }

  addresses[index] = {
    ...addresses[index],
    id: addressId,
    address: normalizedAddress,
    savedAt: new Date().toISOString(),
  }
  writeSavedAddresses(addresses)
}

export function setDefaultSavedAddress(user, addressId) {
  const ownerId = getAddressOwner(user)
  const addresses = readSavedAddresses()
  const addressExists = addresses.some(
    (entry) =>
      entry.ownerId === ownerId &&
      (entry.id ?? makeAddressId(ownerId, entry.address)) === addressId,
  )

  if (!addressExists) {
    throw new Error('This saved address could not be found. Refresh and try again.')
  }

  writeSavedAddresses(
    addresses.map((entry) =>
      entry.ownerId === ownerId
        ? {
            ...entry,
            id: entry.id ?? makeAddressId(ownerId, entry.address),
            isDefault:
              (entry.id ?? makeAddressId(ownerId, entry.address)) === addressId,
          }
        : entry,
    ),
  )
}

export function deleteSavedAddress(user, addressId) {
  const ownerId = getAddressOwner(user)
  const addresses = readSavedAddresses()
  const deletedEntry = addresses.find(
    (entry) =>
      entry.ownerId === ownerId &&
      (entry.id ?? makeAddressId(ownerId, entry.address)) === addressId,
  )

  if (!deletedEntry) {
    throw new Error('This saved address could not be found. Refresh and try again.')
  }

  const remaining = addresses.filter(
    (entry) =>
      !(
        entry.ownerId === ownerId &&
        (entry.id ?? makeAddressId(ownerId, entry.address)) === addressId
      ),
  )

  if (deletedEntry.isDefault) {
    const nextDefault = remaining.find((entry) => entry.ownerId === ownerId)
    if (nextDefault) {
      nextDefault.isDefault = true
    }
  }

  writeSavedAddresses(remaining)
}

function readRegisteredUsers() {
  const storedUsers = window.localStorage.getItem(REGISTERED_USERS_KEY)
  if (!storedUsers) return []

  try {
    const users = JSON.parse(storedUsers)
    if (!Array.isArray(users)) {
      throw new Error('Saved user data has an invalid format.')
    }
    return users
  } catch (error) {
    console.error('Registered user data in browser storage is invalid.', error)
    throw new Error('Saved user data could not be read. Clear the app storage and try again.')
  }
}

function bytesToBase64(bytes) {
  return window.btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(value) {
  return Uint8Array.from(window.atob(value), (character) =>
    character.charCodeAt(0),
  )
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error('Secure password storage is unavailable in this browser.')
  }

  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256,
  )

  return new Uint8Array(hash)
}

export async function authenticateUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = readRegisteredUsers().find(
    (entry) => entry.email.toLowerCase() === normalizedEmail,
  )

  if (!user?.passwordSalt || !user?.passwordHash) return null

  const candidateHash = await hashPassword(
    password,
    base64ToBytes(user.passwordSalt),
  )
  const storedHash = base64ToBytes(user.passwordHash)
  const isValid =
    candidateHash.length === storedHash.length &&
    candidateHash.every((byte, index) => byte === storedHash[index])

  if (!isValid) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

export function readSessionUser() {
  const storedUser = window.localStorage.getItem(SESSION_USER_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch (error) {
    console.error('The current user session in browser storage is invalid.', error)
    window.localStorage.removeItem(SESSION_USER_KEY)
    return null
  }
}

export function saveSessionUser(user) {
  window.localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
}

export function clearSessionUser() {
  window.localStorage.removeItem(SESSION_USER_KEY)
}

export async function saveRegisteredUser(profile) {
  const users = readRegisteredUsers()
  const normalizedEmail = profile.email.trim().toLowerCase()
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail,
  )

  if (existingUser?.passwordSalt && existingUser?.passwordHash) {
    throw new Error('An account with this email already exists. Log in instead.')
  }

  if (typeof profile.password !== 'string' || profile.password.length < 8) {
    throw new Error('Use a password with at least 8 characters.')
  }

  if (!window.crypto?.getRandomValues) {
    throw new Error('Secure password storage is unavailable in this browser.')
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const passwordHash = await hashPassword(profile.password, salt)
  const newUser = {
    id: existingUser?.id ?? `user-${Date.now()}`,
    name: existingUser?.name ?? profile.name.trim(),
    email: normalizedEmail,
    createdAt: existingUser?.createdAt ?? new Date().toISOString(),
    passwordSalt: bytesToBase64(salt),
    passwordHash: bytesToBase64(passwordHash),
  }

  try {
    window.localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify(
        existingUser
          ? users.map((user) => (user.id === existingUser.id ? newUser : user))
          : [...users, newUser],
      ),
    )
  } catch (error) {
    console.error('Unable to save the registered account.', error)
    throw new Error('Your account could not be saved in this browser.')
  }

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
  }
}
