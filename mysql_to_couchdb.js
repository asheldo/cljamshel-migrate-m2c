/*	
        Copyright (C) 2011  Colin Faulkingham, http://3a2d29.com/ 

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
*/

// Configuration file for the database. 
var fs = require('fs');
eval(fs.readFileSync('db.js', encoding="ascii"));


// Setup the MySQL connection and  CouchDB connection
var cradle = require('cradle'), sys = require('sys');
var Client = require('mysql').Client;
var client = new Client();  

client.host =settings.hostdb;
client.user = settings.user;
client.password = settings.password;  

client.connect(function(err, results) {
	if (err) {
		console.log("ERROR: " + err.message);
	    throw err;
	 } 
	 
	 // CouchDB connection
	 var conn = new(cradle.Connection)(settings.couchdbhttp, settings.couchdbhttpport);
	 var db = conn.database('YOUR_COUCH_DATABASE');     
	
	 dbquery(client,conn,db);
});
                            
     
var dbquery=function(client,conn,db)
{   
	// Run the MySQL query
    client.query(
        'SELECT * FROM [YOUR DATABASE].[YOUR_TABLE]',
        function (err, results, fields) {
            if (err) {
                console.log("ERROR: " + err.message);
                throw err;
            }                   
        	db.save(results, 
		  		function (mer, res) {
		      		sys.puts(res);   
			});       
            client.end();  
        });
};                   
