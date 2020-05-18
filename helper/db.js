import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'my_contacts.db' });

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, mobile TEXT NOT NULL, landline TEXT NOT NULL, imageUri TEXT);',
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    });
    return promise;

}

export const loadContacts = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM contacts`,
                [],
                (_, result) => {
                  
                    resolve(result);
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    });
    return promise;
}

export const insertContact = (name, mobile, landline, imageUri) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO contacts(name,mobile,landline,imageUri) values(?,?,?,?)`,
                [name, mobile, landline, imageUri],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    });
    return promise;

}

export const updateContactDetails = (id, name, mobile, landline, imageUri) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('UPDATE contacts SET name = ?, mobile = ?, landline = ?, imageUri = ? WHERE id = ?',
                [name, mobile, landline, imageUri, id],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    });
    return promise;

}


export const removeContact = (id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM contacts where id=?',
                [id],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    });
    return promise;

}
