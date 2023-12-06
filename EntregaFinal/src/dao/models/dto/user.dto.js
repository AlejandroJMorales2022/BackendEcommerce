class UserDTO {

    constructor(user) {
        const { password, firstname, ...dtoUser } = user;
        this.dtoUser = dtoUser;
    }

    getUserData() {
        return this.dtoUser;
    }
}

module.exports = UserDTO;