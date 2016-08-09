(function(document){
	
	// cut the mustard
	if ( ! ( 'querySelector' in document ) ||
		 ! ( 'content' in document.createElement('template') ) )
	{
		return;
	}

	var transforms = [],
		stack = '',
		interval,
		$current = document.getElementById('current'),
		$copy,
		$form = document.querySelector('form'),
		$transform = $form.querySelector('textarea'),
		$submit = $form.querySelector('button'),
		$rearrange = $submit.cloneNode(true),
		$template;
	
	$form.addEventListener('submit',function(e){
		e.preventDefault();
		return false;
	},true);

	// Add the rearrange button
	$rearrange.innerText = 'Rearrange this Tranform Stack';
	$rearrange.addEventListener( 'click', rearrange, false );
	$submit.parentNode.appendChild( $rearrange );
	
	// Handle the submission
	$submit.addEventListener( 'click', apply, false );
	
	function apply()
	{
		console.log('apply');
		if ( $current )
		{
			// Close and archive
			$copy = $current.cloneNode(true);
			$copy.removeAttribute('id');
			$copy.classList.add( 'visualization--previous' );
			$copy.style.transform = $copy.innerText;
			$current.parentNode.insertBefore( $copy, $current );
			
			// Prep for next transform
			$current.style.cssText = null;
			$current.style.transition = 'none';			
		}
		else
		{
			$template = document.getElementById('figure');
			$template = document.importNode( $template.content, true );
			$form.parentNode.appendChild( $template );
			$current = document.getElementById('current');
		}
		$current.querySelector('code').innerText = $transform.value;
		transforms = $transform.value.replace(/[\s\r\n]+/g,' ').split(' ');
		stack = '';
		interval = setInterval( transform, 1000 );
	}

	function transform(){
		if (stack == '')
		{
			$current.removeAttribute('style');
		}
		if ( transforms.length )
		{
			stack += ' ' + transforms.shift();
			$current.style.transform = stack;
		}
		else
		{
			clearInterval(interval);
		}
	}

	function rearrange()
	{
		var array = $transform.value.replace(/[\s\r\n]+/g,' ').split(' '),
			index = array.length,
			temp,
			random;

		// While there remain elements to shuffle...
		while ( 0 !== index )
		{
			// Pick a remaining element...
			random = Math.floor(Math.random() * index);
			index -= 1;

			// And swap it with the current element.
			temp = array[index];
			array[index] = array[random];
			array[random] = temp;
		}

		$transform.value = array.join(' ');
	}

}(this.document));