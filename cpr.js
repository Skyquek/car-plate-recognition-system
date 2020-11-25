var first = true;

function start_cam() {
    Webcam.attach('#my_camera');
    Webcam.set({
        dest_width: 320,
        dest_height: 240,
    });
}

function take_snapshot() {
    Webcam.snap(function (data_uri) {
        var s = data_uri;
        s = s.replace("data:image/jpeg;base64,","");
        s = "'" + s + "'";
        console.log(s);
        document.getElementById('my_result2').innerHTML = document.getElementById('my_result1').innerHTML;
        document.getElementById('my_result1').innerHTML = document.getElementById('my_result').innerHTML;
        document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>'

        function evaluting(){
            // Below is example, u just need to capture the image 
            // and change to base64 format to replace it
            base64_image = s;
            
            // code to send request to server
            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:5000/recognition',
                data: JSON.stringify({
                  'testCode': 'testing_server_code',
                  'base64_image':base64_image
                }),
                contentType: false,
                cache: false,
                processData: false,
                // receive response from server
                success: function(data) {
                    
                    output_1 = data.output_1;
                    output_2 = data.output_2;
                    plate_number = data.result;
                    if(plate_number == 'xxxxx'){
                        plate_number = 'No plate detected';
                        output_1 = '';
                        output_2 = '';
                    }
                    
                    else{
                    // prepare to show in html in format of base64
                    output_1 = "data:image/jpeg;base64," + output_1;
                    document.getElementById("plate").src = output_1;
                    
                    output_2 = "data:image/jpeg;base64," + output_2;
                    document.getElementById("plate_separate").src = output_2;
                    document.getElementById("result").innerHTML  = plate_number;
                    }
                },
            });
        };

        evaluting();
    });
}

function start_snapshot() {
    if (first) {
        first = false;
        var x = setInterval(take_snapshot, 10000);
    }
}