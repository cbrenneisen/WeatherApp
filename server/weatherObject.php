<?

/* weatherObject
 * Creates a properly formatted object with JSON data from Yahoo Weather
 * Created by Carlos Brenneisen 12/13/2015
 */

//class contains a properly formatted weather object, built from a JSON response from Yahoo Weather
class weatherObject{

    //$arguments must be a JSON object
    public function __construct($arguments) {
        //import units
        $units = array("distance"=>'test', "pressure"=>'in', "speed"=>"km", "temperature"=>"F");
        $units = array_merge($units, (array)$arguments->units);

        //title to go in header of weather section
        $this->title = $arguments->description;

        //individual data sections
        $data = array();

        $cur = array('title'=>'Astronomy', 'values'=>array());
        foreach($arguments->astronomy as $key=>$value){
            $cur['values'][ucfirst($key)] = $value;
        }
        $data[] = $cur;

        //properly format atmosphere section
        $cur = array('title'=>'Atmosphere', 'values'=>array());
        foreach($arguments->atmosphere as $key=>$value){
            if ($key == 'humidity'){
                $cur['values']['Humidity'] = $value."%";
            }
            else if ($key == 'pressure'){
                $cur['values']['Pressure'] = $value.$units["pressure"];
            }
            else if ($key == 'rising'){
                $cur['values']['Rising'] = $value.$units["temperature"];
            }
            else if ($key == 'visibility'){
                $cur['values']['Visibility'] = $value.$units["distance"];
            }
        }
        $data[] = $cur;

        //properly format wind section
        $cur = array('title'=>'Wind', 'values'=>array());
        foreach($arguments->wind as $key=>$value){
            if ($key == 'chill'){
                $cur['values']['Chill'] = $value.$units["temperature"];
            }
            else if ($key == 'direction'){
                $cur['values']['Direction'] = $this->degreeToDirection($value);
            }
            else if ($key == 'speed'){
                $cur['values']['Speed'] = $value.$units["speed"];
            }
        }
        $data[] = $cur;

        $item = $arguments->item;

        //link to yahoo weather page
        $this->url = $item->link;

        $this->lat = $item->lat;
        $this->lon = $item->long;
        $this->datetime = $item->pubDate;

        //condition section
        $cur = array("title"=>'Conditions', 'values'=>array());
        foreach($item->condition as $key=>$value){
            if ($key == 'temp'){
                $cur['values']['Temp'] = $value.$units["temperature"];
            }
            else if ($key == 'text'){
                $cur['values'][' '] = $value;
            }
        }
        $data[] = $cur;

        //forecast sections
        foreach($item->forecast as $forecast){
            $title = "Forecast - ".$forecast->day;
            $cur = array('title' => $title, 'values'=>array());
            foreach($forecast as $key=>$value){
                if ($key == 'high'){
                    $cur['values']['High'] = $value.$units['temperature'];
                }
                else if ($key == 'low'){
                    $cur['values']['Low'] = $value.$units['temperature'];
                }
                else if ($key == 'text'){
                    $cur['values'][' '] = $value;
                }
            }
            $data[] = $cur;
        }

        //add all sections to data section
        $this->data = $data;

        //overview of weather
        $this->description = $item->description;
	}

	public function getData(){
        return ['weatherSection'=> $this];
	}

	public function toJSON(){
        return json_encode(['weatherSection'=> $this]);
	}

	//return an appropriate cardinal direction based on a given degree direction (not really well thought out)
	private function degreeToDirection($degree){
        if ($degree < 30){
            return "E";
        }else if ($degree < 75){
            return "NE";
        }else if ($degree < 105){
            return "N";
        }
        else if ($degree < 120){
            return "NW";
        }
        else if ($degree < 165){
            return "W";
        }
        else if ($degree < 210){
            return "SW";
        }
        else if ($degree < 255){
            return "S";
        }
        else if ($degree < 340){
            return "SE";
        }
        return "E";
	}
}

?>