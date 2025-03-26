import {
  pgTable,
  pgEnum,
  serial,
  integer,
  varchar,
  timestamp,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('user', {
  id: integer('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', {
    precision: 3,
    mode: 'date',
  }).defaultNow(),
  updatedAt: timestamp('updatedAt', {
    precision: 3,
    mode: 'date',
  }).defaultNow(),
});

export const certificateType = pgEnum('certificate_type', [
  'higienizacao',
  'impermeabilizacao',
]);

export const tokenBalance = pgTable(
  'token_balance',
  {
    id: serial('id').primaryKey().notNull(),
    type: certificateType().notNull().default('higienizacao'),
    balance: integer().default(0).notNull(),
    userId: integer('user_id').notNull(),
  },
  (table) => ({
    uniqUserType: unique().on(table.userId, table.type),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  }),
);

export const certificates = pgTable(
  'certificate',
  {
    tokenHash: varchar('tokenHash', { length: 64 }).primaryKey().notNull(),
    encryptedData: varchar('encryptedData', { length: 1000 }).notNull(),
    issuedAt: timestamp('issuedAt', { precision: 3, mode: 'date' }).notNull(),
    userId: integer('user_id').notNull(),
    type: certificateType().default('higienizacao').notNull(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  certificates: many(certificates),
  tokenBalances: many(tokenBalance),
}));

export const tokenBalanceRelations = relations(tokenBalance, ({ one }) => ({
  user: one(users, {
    fields: [tokenBalance.userId],
    references: [users.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
}));
