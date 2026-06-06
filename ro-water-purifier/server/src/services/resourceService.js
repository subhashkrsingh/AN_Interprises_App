const BaseRepository = require('../repositories/baseRepository');
const resourceConfigs = require('../repositories/resourceConfigs');
const prisma = require('../config/prisma');

function parseJsonValue(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function toBoolean(value) {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return Boolean(value);
}

function normalizeData(data, config = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(data || {}).filter(([, value]) => value !== undefined && value !== '')
  );

  for (const field of config.numberFields || []) {
    if (cleaned[field] !== undefined) cleaned[field] = Number(cleaned[field]);
  }

  for (const field of config.intFields || []) {
    if (cleaned[field] !== undefined) cleaned[field] = Number.parseInt(cleaned[field], 10);
  }

  for (const field of config.booleanFields || []) {
    if (cleaned[field] !== undefined) cleaned[field] = toBoolean(cleaned[field]);
  }

  for (const field of config.dateFields || []) {
    if (cleaned[field] !== undefined) cleaned[field] = new Date(cleaned[field]);
  }

  for (const field of config.jsonFields || []) {
    if (cleaned[field] !== undefined) cleaned[field] = parseJsonValue(cleaned[field]);
  }

  return cleaned;
}

function configFor(resource) {
  const config = resourceConfigs[resource];
  if (!config) {
    const error = new Error(`Unknown resource: ${resource}`);
    error.statusCode = 404;
    throw error;
  }
  return config;
}

function repositoryFor(resource) {
  const config = configFor(resource);

  return new BaseRepository(config.modelName, config);
}

async function applyCreateDefaults(resource, data) {
  const config = configFor(resource);
  const normalized = normalizeData(data, config);

  if (config.sequence && !normalized[config.sequence.field]) {
    const count = await prisma[config.modelName].count();
    normalized[config.sequence.field] = `${config.sequence.prefix}-${String(count + 1).padStart(5, '0')}`;
  }

  return normalized;
}

async function list(resource, query) {
  return repositoryFor(resource).list(query);
}

async function get(resource, id) {
  const item = await repositoryFor(resource).findById(id);
  if (!item) {
    const error = new Error('Record not found.');
    error.statusCode = 404;
    throw error;
  }
  return item;
}

async function create(resource, data) {
  const payload = await applyCreateDefaults(resource, data);
  return repositoryFor(resource).create(payload);
}

async function update(resource, id, data) {
  const config = configFor(resource);
  return repositoryFor(resource).update(id, normalizeData(data, config));
}

async function remove(resource, id) {
  return repositoryFor(resource).delete(id);
}

async function restore(resource, id) {
  return repositoryFor(resource).restore(id);
}

module.exports = { list, get, create, update, remove, restore };
