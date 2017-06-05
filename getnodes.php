<?php

function dirToArray($dir) { 

    $result = array(); 

    $cdir = scandir($dir . DIRECTORY_SEPARATOR); 
    foreach ($cdir as $key => $value) 
    { 
       
        
        if (!in_array($value,array(".","..")) && strpos($value, '.json') == false) { 
        
            $valArray = array();
            $valArray["id"] = preg_replace('/\\.[^.\\s]{3,4}$/', '', $value);
            
            $valArray["loc"] = $dir . DIRECTORY_SEPARATOR . $value;
            
            if (file_exists($dir . DIRECTORY_SEPARATOR . $valArray["id"] . ".json")) {
                $json = file_get_contents($dir . DIRECTORY_SEPARATOR . $valArray["id"] . ".json");
                
                $decoded = json_decode($json, true);
                
                $valArray["settings"] = $decoded;
            }
        
            if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) 
            { 
                $valArray["children"] = dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
            }
            
            $result[] = $valArray; 
        }
        

    } 
   
    return $result; 
} 

$results = dirToArray("nodes");

$json = json_encode($results);

echo ($json);