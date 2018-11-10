import React from 'react';

const Notification = ({ message }) => {

    if (message === null) {
        return null;
    }

    const style = {
        backgroundColor: "green",
        padding: "10px",
        borderStyle: "dotted",
        marginBottom: "20px"
    }

    return (
        <div className="notificattion" style={style}>
            {message}
        </div>
    );
};

export default Notification;