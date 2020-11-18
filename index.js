const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "top_songsdb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");  
    askUser();
    // connection.end();  
});

const askUser = () => inquirer.prompt([
    {
        type: 'list',
        name: "chooseOne",
        message: "What do you want to do?",
        choices: [
            "Populating songs by artist name",
            "Retrieving artists who appear more than once in the database", 
            "Retrieve a song to see its position",
            "Retrieving songs in range",
            "Exit"
        ]
    }
])
.then(function(answer) {    
    switch(answer.chooseOne) {
        case "Populating songs by artist name":
            return selectArtist();
            break;
        case "Retrieving artists who appear more than once in the database":
            return multipleAppearance(); 
            break;
        case "Retrieve a song to see its position":
            return retrieveSong();
            break;
        case "Retrieving songs in range":
            return songsInRange();
            break;
        case "Exit":
            connection.end();   
    }   
});

function selectArtist() {
    inquirer.prompt(
        {
            type: "input",
            name: "name",
            message: "Enter artist's name"
        }
    )
    .then(res => {
        let sql = 'SELECT * FROM top5000 WHERE artist_name = ?'
        connection.query(sql, [res.name], (err, data) => {
            if(err) throw err;
            for(const song of data) {
                console.log(`${song.position} | ${song.artist_name} | ${song.song_name} | ${song.year} | ${song.rps_USA}`)
            }
            askUser();
        })       
    })
    
}


function multipleAppearance() {
    let query = 'SELECT * FROM top5000 GROUP BY artist_name HAVING COUNT(artist_name) > 1'
    connection.query(query, (err, data) => {
        if(err) throw err;
        for(const song of data) {
            console.log(`${song.artist_name}`)
        }
        askUser();
    })
}

function retrieveSong() {
    inquirer.prompt(
        {
            name: 'song',
            type: "input",
            message: 'Please Enter the same of the song?'
        }
    )
    .then(res => {
        let query = 'SELECT * FROM top5000 WHERE song_name = ?'
        connection.query(query, [res.song], (err, data) => {
            if(err) throw err;
            // console.log(data)
            data = JSON.parse(JSON.stringify(data))
            // console.log(data)
            console.log(`${data[0].position} | ${data[0].artist_name} | ${data[0].song_name} | ${data[0].year} | ${data[0].rps_USA}`);
            askUser();
        })
    })
    
}

function songsInRange() {
    inquirer.prompt([
        {
            type: "input",
            name: "start",
            message: "from which position"            
        },
        {
            type: "input",
            name: "end",
            message: "to which position"           
        }
    ])
    .then(answer => {
        let query = 'SELECT * FROM top5000 WHERE position BETWEEN ? AND ?'
        connection.query(query, [answer.start, answer.end], (err, data) => {
            if(err) throw err;
            for(const song of data) {
                console.log(`${song.position} | ${song.artist_name} | ${song.song_name} | ${song.year} | ${song.rps_USA}`)
            }
            askUser();
        })
    })
}