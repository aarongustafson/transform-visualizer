<?php

require __DIR__ . '/vendor/autoload.php';

$HtmlCompress = \WyriHaximus\HtmlCompress\Factory::construct();

$data = [
	'previous'		=> false,
	'previously'	=> [],
	'current'		=> false,
];

# get the CSS to embed
$data['css'] = file_get_contents(__DIR__ . '/source/main.css');

# get the JavaScript to embed
$data['js'] = file_get_contents(__DIR__ . '/source/main.js');

# get the base HTML
$html = file_get_contents(__DIR__ . '/source/main.html');

# User has submitted something
if ( count($_POST) )
{
	# previous visualization(s)
	$previously = $_POST['previously'];
	if ( ! empty( $previously ) )
	{
		$previously = json_decode( base64_decode( $previously ), true );
		$data['previous'] = $previously;
	}
	else
	{
		$previously = [];
	}

	# new visualization
	$to_visualize = $_POST['to_visualize'];
	if ( ! empty( $to_visualize ) )
	{
		# inject the value
		$data['current'] = [
			'transform' => $to_visualize
		];
		# add the animated CSS
		$to_visualize = explode( ' ', $to_visualize );
		$visualization_data = [
			'animation_duration' => count( $to_visualize ) / 2 
		];
		$segment_percentage = ( 1 / ( count( $to_visualize ) - 1 ) ) * 100;
		$keyframes = '';
		$stack = '';
		foreach ( $to_visualize as $index => $transform )
		{
			$stack .= " {$transform}";
			$keyframes .= ($segment_percentage * $index) . "% { transform: {$stack}; }";
		}
		$visualization_data['keyframes'] = $keyframes;
	}
	else
	{
		$data['current'] = [];
	}

	# merge to previously
	$previously[] = $data['current']; 
	$data['previously'] = base64_encode( json_encode( $previously ) );
}

$Mustache = new Mustache_Engine([
	'escape' => function($value) {
        return htmlspecialchars($value, ENT_NOQUOTES, 'UTF-8');
    }
]);

# build the visualization
$visualization_css = file_get_contents(__DIR__ . '/source/visualization.css');
$data['css'] .= $Mustache->render(
	$visualization_css,
	$visualization_data
);

# build the HTML
$show = $Mustache->render(
	$html,
	$data
);

# compress & output
echo $HtmlCompress->compress($show);

?>