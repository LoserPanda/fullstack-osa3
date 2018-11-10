import React, { Component } from 'react';

class FilterPersons extends Component {
    render() {
        return (
            <div>
                rajaa näytettäviä <input
                    value={this.props.filterPersons}
                    onChange={this.props.handleFilterChange}
                />
            </div>
        );
    }
}

export default FilterPersons;