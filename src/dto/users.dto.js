export class currentUserDto {
  constructor(userData) {
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.fullName = `${userData.firstName} ${userData.lastName}`;
    this.email = userData.email;
    this.age = userData.age;
    this.role = userData.role;
    this.cart = userData.cart;
  }
}