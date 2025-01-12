import { ValidationError } from './errors';

export function validateProfileUpdates(updates) {
  const allowedFields = ['displayName', 'photoURL', 'email'];
  const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
  
  if (invalidFields.length > 0) {
    throw new ValidationError(`Invalid profile fields: ${invalidFields.join(', ')}`);
  }
  
  if (updates.displayName && typeof updates.displayName !== 'string') {
    throw new ValidationError('Display name must be a string');
  }
  
  if (updates.email && typeof updates.email !== 'string') {
    throw new ValidationError('Email  must be a string'); 
  }
  
  if (updates.email && !updates.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
  
  return true;
}

export function validateUserData(user) {
  if (!user || !user.uid || !user.email) {
    throw new Error('Invalid user data');
  }
}


export function validateInventoryMetadata(metadata) {
  const requiredFields = ['name', 'quantity', 'category'];
  
  for (const field of requiredFields) {
    if (!metadata[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate quantity is a positive number
  if (typeof metadata.quantity !== 'number' || metadata.quantity < 0) {
    throw new Error('Quantity must be a positive number');
  }

  // Validate expiry date if provided
  if (metadata.expiryDate) {
    const expiryDate = new Date(metadata.expiryDate);
    if (isNaN(expiryDate.getTime())) {
      throw new Error('Invalid expiry date');
    }
  }

  return true;
}

export function validateInventoryUpdate(updates) {
  if (updates.quantity !== undefined) {
    if (typeof updates.quantity !== 'number' || updates.quantity < 0) {
      throw new Error('Quantity must be a positive number');
    }
  }

  if (updates.expiryDate) {
    const expiryDate = new Date(updates.expiryDate);
    if (isNaN(expiryDate.getTime())) {
      throw new Error('Invalid expiry date');
    }
  }

  return true;
}