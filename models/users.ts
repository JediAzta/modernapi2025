interface User {
    id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

export const users: User[] = [
    {id: 1, username: 'admin', password: 'admin', firstname: 'Admin', lastname: 'Admin'},
    {id: 2, username: 'picard', password: '1234567890', firstname: 'Picard', lastname: 'Jean-Luc'},
];