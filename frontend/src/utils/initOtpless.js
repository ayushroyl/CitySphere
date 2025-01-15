export const initOTPless = (callback) => {

	const otplessInit = Reflect.get(window, 'otplessInit')

	const loadScript = () => {
		const isScriptLoaded = document.getElementById("otpless-sdk");
		if(isScriptLoaded) return;

		const script = document.createElement('script')
		script.id = 'otpless-sdk'
		script.type = 'text/javascript'
		script.src = 'https://otpless.com/v3/auth.js'
		// TODO: Add your app id
		script.setAttribute('data-appid', 'YCA6ETYALU181T72ZSG1')
		document.head.appendChild(script)
	}

	otplessInit ? otplessInit() : loadScript()

	Reflect.set(window, 'otpless', callback)
}


export const unloadScript = () => {
	const script = document.getElementById('otpless-sdk')
	script && script.remove()
}