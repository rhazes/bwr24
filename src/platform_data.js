

platform_config = [
    // properties for platform x,y,l (this is the length),type)
    {x:300, y:300,l:70,type:'normal'},
    {x:100, y:330,l:70,type:'normal'},
    {x:200, y:200,l:70,type:'normal'},

]

const PLATFORM_THICKNESS = 10;

/* 
_config is a list of platforms 
with the data format in the example 
above
*/
function loadPlatforms(_config) {
    _config.forEach( 
        (c) => {
            createPlatform(c.x,c.y,c.l,PLATFORM_THICKNESS)
        }  
    ); 
}