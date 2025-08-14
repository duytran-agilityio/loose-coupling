export class MySQLUserRepository {
  getById(id: number): string {
    return `User ${id} from MySQL`;
  }
}
