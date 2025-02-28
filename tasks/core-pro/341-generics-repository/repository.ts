import { DataAccess } from './DataAccess.ts';

interface Identifiable {
  id?: number
}

export interface User extends Identifiable {
  name: string;
  email: string;
}

export interface Product extends Identifiable {
  name: string;
  price: number;
}

export class UserRepository {
  private dataAccess: DataAccess;

  constructor(dataAccess: DataAccess) {
    this.dataAccess = dataAccess;
  }

  async getById(id: number) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const res = await this.dataAccess.query<User>(query, values);
    return res.rows[0];
  }

  async getAll() {
    const query = 'SELECT * FROM users';
    const res = await this.dataAccess.query<User>(query);
    return res.rows;
  }

  async insert(user: Omit<User, 'id'>) {
    const { name, email } = user;
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const values = [name, email];
    const res = await this.dataAccess.query<User>(query, values);
    return res.rows[0];
  }
}



export class ProductRepository {
  private dataAccess: DataAccess;

  constructor(dataAccess: DataAccess) {
    this.dataAccess = dataAccess;
  }

  async getById(id: number) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const values = [id];
    const res = await this.dataAccess.query<Product>(query, values);
    return res.rows[0];
  }

  async getAll() {
    const query = 'SELECT * FROM products';
    const res = await this.dataAccess.query<Product>(query);
    return res.rows;
  }

  async insert(product: Omit<Product, 'id'>) {
    const { name, price } = product;
    const query = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';
    const values = [name, price];
    const res = await this.dataAccess.query<Product>(query, values);
    return res.rows[0];
  }
}

export class Repository<T extends Identifiable> {
  private dataAccess: DataAccess
  private tableName: string

  constructor(dataAccess: DataAccess, tableName: string) {
    this.dataAccess = dataAccess
    this.tableName = tableName
  }

  async getById(id: number): Promise<T> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const values = [id];
    const res = await this.dataAccess.query<T>(query, values);
    return res.rows[0] as T;
  }

  async getAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const res = await this.dataAccess.query<T>(query);
    return res.rows;
  }

  async insert(item: T): Promise<T> {
    // const { name, price } = product;
    const columns = Object.keys(item).filter((key) => key !== "id")
    const values = columns.map((_, i) => `$${i + 1}`)
    const placeholders = columns.map((col) => (item as any)[col])
    const query = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${values.join(", ")}) RETURNING *`;
    // const values = [name, price];
    const res = await this.dataAccess.query<T>(query, placeholders);
    return res.rows[0];
  }
}
