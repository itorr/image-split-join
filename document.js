
const readFileToURL = (file,onOver)=>{
	var reader = new FileReader();
	reader.onload = ()=>{
		const src = reader.result;
		onOver(src);
	};
	reader.readAsDataURL(file);
};

const readFileAndSetIMGSrc = file=>{
	readFileToURL(file,src=>{
		app.$refs.img.src = src;
	});
};

function chooseFileAndSetImageSrc(){
    chooseFile(readFileAndSetIMGSrc)
}

document.addEventListener('paste',e=>{
	// console.log(e.clipboardData,e.clipboardData.files);

	const clipboardData = e.clipboardData;
	if(clipboardData.items[0]){
		let file = clipboardData.items[0].getAsFile();

		if(file && isImageRegex.test(file.type)){
			return readFileAndSetIMGSrc(file);
		}
	}

	if(clipboardData.files.length){
		for(let i = 0;i<clipboardData.files.length;i++){
			if(isImageRegex.test(clipboardData.files[i].type)){
				console.log(clipboardData.files[i])
				readFileAndSetIMGSrc(clipboardData.files[i]);
			}
		}
	}
});
document.addEventListener('dragover',e=>{
	e.preventDefault();
});
document.addEventListener('drop',e=>{
	e.preventDefault();

	const file = e.dataTransfer.files[0];

	if(file && file.type.match(isImageRegex)){
		readFileAndSetIMGSrc(file);
	}
});


const chooseFile = callback=>{
	chooseFile.form.reset();
	chooseFile.input.onchange = function(){
		if(!this.files||!this.files[0])return;
		callback(this.files[0]);
	};
	chooseFile.input.click();
};
chooseFile.form = document.createElement('form');
chooseFile.input = document.createElement('input');
chooseFile.input.type = 'file';
chooseFile.input.accept = 'image/*';
chooseFile.form.appendChild(chooseFile.input);

const request = (method,uri,data,callback)=>{
	let body = null;
	if(data){
		body = JSON.stringify(data);
	}
	fetch(uri,{
		method,
		mode: 'cors',
		body,
		credentials: 'include',
		headers: {
			'content-type': 'application/json'
		}
	}).then(res => res.json()).then(data => callback(data)).catch(error => console.error(error))
};



const isImageRegex = /^image\/(.+)$/;

const deepCopy = o=>JSON.parse(JSON.stringify(o));

let defaultConfig = {
	direction:'horizontal',
	sliceXMinCount:22,
	sliceYMinCount:23,
	splitCount:2,
	mode:'pixel', //draw pixel
	quality:95,
};
let config = deepCopy(defaultConfig);

const data = {
	src:'totoro-avatar.jpg',
	output:null,
	runing:false,
	config
};




const app = new Vue({
	el:'.app',
	data,
	methods:{
		generate(){
			this.output = generate(this.$refs.img,this.config,app)
		},
		_generate(){
			clearTimeout(this.T)
			this.T = setTimeout(this.generate,100)
		},
		chooseFileAndSetImageSrc,
		reset(){
			const _config = deepCopy(defaultConfig)
			this.config = _config
		},
		save(){
			const a = document.createElement('a');
			a.href = this.output;
			a.download = `[lab.magiconch.com][图像切割粘贴器]-${+Date.now()}.png`;
			a.click();
		}
	},
	watch:{
		config:{
			deep:true,
			handler(){
				this._generate()
			}
		}
	},
	computed:{
		
	}
})

const loadScript = (src,el) =>{
	el = document.createElement('script');
	el.src = src;
	document.body.appendChild(el);
};

window._hmt = [];
window.dataLayer = [
    ['js', new Date()],
    ['config', 'G-13BQC1VDD8']
];
window.gtag = function(){dataLayer.push(arguments)};
setTimeout(_=>{
	loadScript('//hm.baidu.com/hm.js?f4e477c61adf5c145ce938a05611d5f0');
	loadScript('//www.googletagmanager.com/gtag/js?id=G-13BQC1VDD8');
},400);