import React, { Component } from 'react';
import Person from './components/Person';
import FilterPersons from './components/FilterPersons';
import personService from './services/persons';
import Notification from './components/Notification';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            filterPersons: '',
            success: null
        }

    }

    componentDidMount() {
        personService
            .getAll()
            .then(persons => {
                this.setState({ persons });
            })
            .catch(error => {
                console.log('Epic fail while fetching data');
            });
    }


    addPerson = (event) => {
        event.preventDefault();
        const personObject = {
            name: this.state.newName,
            number: this.state.newNumber
        }

        var check = true;
        this.state.persons.forEach((item, index, array) => {
            if (personObject.name === item.name) {
                check = false;
            }
        });

        if (check) {
            console.log('a new person added');
            personService
                .create(personObject)
                .then(response => {
                    this.setState({
                        persons: this.state.persons.concat(response),
                        newName: '',
                        newNumber: '',
                        success: `Uusi henkilö ${personObject.name} lisätty onnistuneesti!`
                    });
                    setTimeout(() => {
                        this.setState({ success: null })
                    }, 5000)
                })
        } else {
            console.log('person already exists!');
            const result = window.confirm("Muutetaanko henkilön " + personObject.name + " numeroa?")
            if (result) {
                const person = this.state.persons.find(n => n.name === personObject.name);
                const changedPerson = { ...person, number: personObject.number }
                console.log(changedPerson);
                personService
                    .modify(changedPerson.id, changedPerson)
                    .then(response => {
                        console.log(response.data);
                        this.setState({
                            persons: this.state.persons.map(e => e.id === changedPerson.id ? changedPerson : e),
                            newName: '',
                            newNumber: '',
                            success: `Henkilön ${personObject.name} puhelinnumeroa muutettu onnistuneesti!!`
                        });
                        setTimeout(() => {
                            this.setState({ success: null })
                        }, 5000)
                    })
                    .catch(err => {
                        console.log('poistettu jo!!');
                        alert(`Henkilö '${personObject.name}' on jo valitettavasti poistettu palvelimelta, joten muokkaaminen ei onnistu! Voit lisätä henkilön kokonaan uutena painamalla "lisää".`);
                        this.setState({ persons: this.state.persons.filter(n => n.name !== personObject.name) })
                    })
            } else {
                this.setState({
                    newName: '',
                    newNumber: ''
                });
            }
        }

    }

    deletePerson = (id) => {
        const result = window.confirm("Postetaanko henkilö " + id + "?")
        console.log('delete');
        const persons = this.state.persons.filter(person => person.id !== id);
        if (result) {
            personService
                .remove(id)
                .then(response => {
                    console.log(response);
                    this.setState({
                        persons,
                        success: `Henkilö poistettu onnistuneesti!`
                    });
                    setTimeout(() => {
                        this.setState({ success: null })
                    }, 5000)
                })
        }

    }

    handleNameChange = (event) => {
        this.setState({ newName: event.target.value });
    }

    handleNumberChange = (event) => {
        this.setState({ newNumber: event.target.value });
    }

    handleFilterChange = (event) => {
        this.setState({ filterPersons: event.target.value });
    }

    render() {
        console.log('render');
        const personsToShow =
            this.state.filterPersons === '' ?
                this.state.persons :
                this.state.persons.filter(person => person.name.toLowerCase().includes(this.state.filterPersons.toLowerCase()) || person.number.toLowerCase().includes(this.state.filterPersons.toLowerCase()))

        return (
            <div>
                <h1>Puhelinluettelo</h1>
                <Notification message={this.state.success} />
                <FilterPersons filterPersons={this.state.filterPersons} handleFilterChange={this.handleFilterChange} />
                <h2>Lisää uusi</h2>
                <form onSubmit={this.addPerson} >
                    <div>
                        nimi: <input
                            value={this.state.newName}
                            onChange={this.handleNameChange}
                        />
                    </div>
                    <div>
                        numero: <input
                            value={this.state.newNumber}
                            onChange={this.handleNumberChange}
                        />
                    </div>
                    <div>
                        <button type="submit">lisää</button>
                    </div>
                </form>
                <h2>Numerot</h2>
                <ul id="persons">
                    {personsToShow.map(person => <Person deletePerson={this.deletePerson} key={person.id} id={person.id} name={person.name} number={person.number} />)}
                </ul>
            </div>
        )
    }
}

export default App;