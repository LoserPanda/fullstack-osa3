import React from 'react';

const Person = ({ name, number, deletePerson, id }) => {

    return (
        <div>
            <li>
                {name} {number}
                <button onClick={() => deletePerson(id)}>Delete</button>
            </li>
        </div>
    );
};

export default Person;