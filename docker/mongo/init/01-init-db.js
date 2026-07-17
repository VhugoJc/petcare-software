// =============================================================================
// PetCare Software — MongoDB Initialization Script
// =============================================================================
// This script runs once when MongoDB is first created (empty /data/db).
// It creates the application database, collections, indexes, and seed data.
//
// Environment variables available:
//   MONGO_INITDB_ROOT_USERNAME — Root admin user
//   MONGO_INITDB_ROOT_PASSWORD — Root admin password
//   MONGO_INITDB_DATABASE     — Target database name (petcare)
// =============================================================================

// Switch to the application database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'petcare');

// =============================================================================
// Collections Creation
// =============================================================================
// MongoDB creates collections lazily on first insert, but we create them
// explicitly here to define validation schemas from the start.

const collections = [
  {
    name: 'users',
    options: {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'firstName', 'lastName', 'role'],
          properties: {
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'must be a valid email address'
            },
            firstName: { bsonType: 'string', description: 'must be a string' },
            lastName: { bsonType: 'string', description: 'must be a string' },
            role: {
              enum: ['admin', 'veterinarian', 'receptionist', 'manager'],
              description: 'must be a valid user role'
            },
            isActive: { bsonType: 'bool', description: 'must be a boolean' }
          }
        }
      }
    }
  },
  {
    name: 'owners',
    options: {},
  },
  {
    name: 'pets',
    options: {},
  },
  {
    name: 'appointments',
    options: {},
  },
  {
    name: 'medical_records',
    options: {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['petId', 'appointmentId', 'diagnosis', 'treatment'],
          properties: {
            petId: { bsonType: 'objectId' },
            appointmentId: { bsonType: 'objectId' },
            veterinarianId: { bsonType: 'objectId' },
            diagnosis: { bsonType: 'string' },
            treatment: { bsonType: 'string' },
            prescription: {
              bsonType: 'object',
              properties: {
                medicationName: { bsonType: 'string' },
                dosage: { bsonType: 'string' },
                frequency: { bsonType: 'string' },
                duration: { bsonType: 'string' }
              }
            },
            notes: { bsonType: 'string' },
            createdAt: { bsonType: 'date' }
          }
        }
      }
    }
  },
  {
    name: 'inventory',
    options: {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'category', 'quantity', 'unitPrice'],
          properties: {
            name: { bsonType: 'string' },
            category: {
              enum: ['medication', 'supply', 'food', 'equipment', 'other'],
              description: 'must be a valid category'
            },
            quantity: { bsonType: 'int', minimum: 0 },
            unitPrice: { bsonType: 'double', minimum: 0 },
            supplier: { bsonType: 'string' },
            reorderLevel: { bsonType: 'int', minimum: 0 },
            isActive: { bsonType: 'bool' }
          }
        }
      }
    }
  }
];

// Create collections if they don't exist
collections.forEach(function (col) {
  const existingCollections = db.getCollectionNames();
  if (existingCollections.indexOf(col.name) === -1) {
    db.createCollection(col.name, col.options);
    print('✓ Created collection: ' + col.name);
  } else {
    print('− Collection already exists: ' + col.name);
  }
});

// =============================================================================
// Indexes
// =============================================================================
// Indexes are critical for production performance. Created here to ensure
// they exist from day one.

// Users indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Owners indexes
db.owners.createIndex({ email: 1 }, { unique: true });
db.owners.createIndex({ lastName: 1 });
db.owners.createIndex({ phone: 1 });

// Pets indexes
db.pets.createIndex({ ownerId: 1 });
db.pets.createIndex({ name: 1, ownerId: 1 });
db.pets.createIndex({ species: 1 });
db.pets.createIndex({ microchipId: 1 }, { sparse: true });

// Appointments indexes
db.appointments.createIndex({ date: 1, time: 1 });
db.appointments.createIndex({ petId: 1, date: 1 });
db.appointments.createIndex({ ownerId: 1 });
db.appointments.createIndex({ veterinarianId: 1, date: 1 });
db.appointments.createIndex({ status: 1, date: 1 });

// Medical records indexes
db.medical_records.createIndex({ petId: 1, createdAt: -1 });
db.medical_records.createIndex({ appointmentId: 1 }, { unique: true });

// Inventory indexes
db.inventory.createIndex({ name: 1 });
db.inventory.createIndex({ category: 1 });
db.inventory.createIndex({ quantity: 1 });

print('✓ All indexes created successfully.');

// =============================================================================
// Seed Data — Development Users
// =============================================================================
// The default admin user (admin@petcare.com / admin123) is created by the
// backend on startup (see auth.service.ts → seedAdminUser) using proper
// bcrypt hashing. This init script only creates indexes and schemas.
// =============================================================================

print('− User seed data deferred to backend application startup.');

print('');
print('╔══════════════════════════════════════════════════════════════╗');
print('║  PetCare MongoDB initialization completed successfully!     ║');
print('╚══════════════════════════════════════════════════════════════╝');