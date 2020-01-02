var express = require('express');
var app = express();
var ExifImage = require('exif').ExifImage;
var formidable = require('formidable');

var fs = require('fs');
app.get('/', function (req, res) {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(' <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">');
    res.write('<html><body><div class="container-fluid"><h1>Upload a Photo</h1><p><form action="/fileupload" method="post" enctype="multipart/form-data">  Tittle: <br><input type="text" name="tittle"><br>Description: <br><input type="text" name="description"></br> Photo:</br> <input name="filetoupload"  type="file"></br></br><input class="btn btn-info" type="submit" value="Upload"></form> <br></div>');
	res.end();
})
 

 
 
 
 app.post('/fileupload', function (req, res) {
	var form = new formidable.IncomingForm();
	res.writeHead(200, {"Content-Type": "text/html"});
	form.parse(req, function(err, fields, files) {
		res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>');
		res.write(' <meta charset="utf-8">');
		res.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
		res.write(' <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">');
		res.write(' <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>');
		res.write(' <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>');
		res.write(' <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>');
			res.write('<div class="container-fluid">');
		    res.write("<h1>"+fields.tittle+"</h1>");
			res.write("<p>"+fields.description+"</p>");
		
						try {
					new ExifImage({ image : files.filetoupload.path }, function (error, exifData) {
						if (error)
							console.log('Error: '+error.message);
						else{
							//console.log(exifData); // Do something with your data!
							fs.readFile(files.filetoupload.path, (err,data) => {
							var image = exifData["image"];
							var gps= exifData["gps"];

							res.write(' <div class="row">	');
   						res.write('<div class="col-6"> <img style="width:650px; height:auto"src="data:image/jpeg;base64,');
						  res.write(Buffer.from(data).toString('base64'));	
							res.write('" style="width:800px; height:auto"');			  
							res.write('/></div><div class="col-6"> Make: '+image["Make"]+'</p>');
							res.write("<p> Model: "+image["Model"]+"</p>");
							res.write("<p> Created on: "+image["ModifyDate"]+"</p>");
							res.write('<p> Location:<form action="/map" method="post"> <input type="hidden" name="latitude_degrees" value="'+ gps["GPSLatitude"]['0']+'"><input type="hidden" name="latitude_minutes" value="'+ gps["GPSLatitude"]['1']+'"><input type="hidden" name="latitude_seconds" value="'+ gps["GPSLatitude"]['2']+'"><input type="hidden" name="latitudeRef" value="'+ gps["GPSLatitudeRef"]+'"><input type="hidden" name="longitude_degrees" value="'+ gps["GPSLongitude"]['0']+'"><input type="hidden" name="longitude_minutes" value="'+ gps["GPSLongitude"]['1']+'"><input type="hidden" name="longitude_seconds" value="'+ gps["GPSLongitude"]['2']+'"><input type="hidden" name="longituderef" value="'+ gps["GPSLongitudeRef"]+'">');
							res.write(' <input type="submit" value="Map"></form></p>');
							res.write(' <a href="/" class="btn btn-info">Home</a></div></div>');
							
							res.end();
							});
						}
					
					});
				} catch (error) {
					console.log('Error: ' + error.message);
				}
    

	
    });
	});
	app.post('/map', function (req, res){
				res.writeHead(200, {"Content-Type": "text/html"});
					res.write(' <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">');
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
		
		
		var latitude = parseFloat(fields.latitude_degrees) + parseFloat(fields.latitude_minutes/60) + parseFloat (fields.latitude_seconds/3600);
		
		if (fields.latitudeRef == "S" || fields.latitudeRef == "W") {
        latitude = latitude * -1; 
		}
		
		var longitude = parseFloat(fields.longitude_degrees) +parseFloat (fields.longitude_minutes/60) + parseFloat(fields.longitude_seconds/3600);
		
		if (fields.longituderef == "S" || fields.longituderef == "W") {
        longitude = longitude * -1; 
		}
		

		res.write('<html><body><iframe src="https://maps.google.com/maps?q='+latitude+','+longitude+'&hl=en&z=14&amp;output=embed" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe></iframe></body></html>')
		res.write('<form>  <input class="btn btn-info" type="button" value="Go back!" onclick="history.back()"></form>');
		
		res.end();
		}
		);
		
	}
);
app.listen(8080);