export class UserService {
  private readonly token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('Invalid Token');
    }

    this.token = token;
  }

  async verifyUser() {
    console.log('Using token:', this.token);

    return {
      usn: 1234,
      name: 'gy',
    };
  }
}
