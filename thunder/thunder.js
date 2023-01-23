function popup(elm) {
	box = elm.parentElement.querySelector('nav');

	if(window.getComputedStyle(elm.parentElement).getPropertyValue('flex-direction') == 'row'){
		box.classList.add('sb');
		box.classList.remove('sr');
	} else {
		box.classList.remove('sb');
		box.classList.add('sr');
	}

	box.classList.toggle('shown');
}
