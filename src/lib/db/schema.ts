import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table
export const users = pgTable('user', {
  id: integer('id').primaryKey().notNull(),
  certificateTokenId: integer('certificateTokenId'),
  createdAt: timestamp('createdAt', {
    precision: 3,
    mode: 'date',
  }).defaultNow(),
  updatedAt: timestamp('updatedAt', {
    precision: 3,
    mode: 'date',
  }).defaultNow(),
});

// CertificateTokens table
export const certificateTokens = pgTable(
  'certificate_tokens',
  {
    id: serial('id').primaryKey().notNull(),
    userId: integer('user_id').notNull(),
    higienizacao: integer('higienizacao').default(0).notNull(),
    createdAt: timestamp('createdAt', {
      precision: 3,
      mode: 'date',
    }).defaultNow(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'date',
    }).defaultNow(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  }),
);

// Certificate table
export const certificates = pgTable(
  'certificate',
  {
    tokenHash: varchar('tokenHash', { length: 64 }).primaryKey().notNull(),
    encryptedData: varchar('encryptedData', { length: 1000 }).notNull(),
    issuedAt: timestamp('issuedAt', { precision: 3, mode: 'date' }).notNull(),
    userId: integer('user_id').notNull(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  }),
);

// Relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  certificateTokens: one(certificateTokens, {
    fields: [users.certificateTokenId],
    references: [certificateTokens.id],
  }),
  certificates: many(certificates),
}));

export const certificateTokensRelations = relations(
  certificateTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [certificateTokens.userId],
      references: [users.id],
    }),
  }),
);

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
}));
