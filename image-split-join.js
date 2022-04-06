
//神奇数字
const fixNumA = 10001;
const fixNumB = 10000;





const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')

const canvasOutput = document.createElement('canvas');
const ctxOutput = canvasOutput.getContext('2d')

// document.body.appendChild(canvas)

const generate = (imageEl,config,callback)=>{
    const naturalWidth = imageEl.naturalWidth
    const naturalHeight = imageEl.naturalHeight

	let width = naturalWidth
	let height = naturalHeight


	// console.log(naturalWidth,naturalHeight)
	let { 
		direction ,
		sliceXMinCount ,
		sliceYMinCount , 
		splitCount ,
		mode,
		quality
	} = config

	sliceYMinCount = sliceXMinCount;

	let sliceXCount = sliceXMinCount * splitCount;
	let sliceYCount = sliceYMinCount * splitCount;



	if(direction === 'horizontal'){

	}else{
		//vertical
		 
	}


	if( mode === 'draw' ){
		
		let pixWidth  = width  / sliceXCount
		let pixHeight = height / sliceYCount

		canvas.width = width
		canvas.height = height

		for(let sliceXindex = 0;sliceXindex < sliceXCount;sliceXindex++){
			for(let sliceYindex = 0;sliceYindex < sliceYCount;sliceYindex++){

				let sx = sliceXindex * pixWidth;
				let sy = sliceYindex * pixHeight;
				let sw = pixWidth;
				let sh = pixHeight;
				
				//分组的所在位置
				let splitX = (sliceXindex % splitCount);
				let splitY = (sliceYindex % splitCount);

				let x = width  * splitX / splitCount + Math.floor(sliceXindex / splitCount) * pixWidth;
				let y = height * splitY / splitCount + Math.floor(sliceYindex / splitCount) * pixHeight;
				let w = pixWidth;
				let h = pixHeight;

				// console.log(sliceXindex,sliceYindex,/i/,x,y)
				ctx.drawImage(imageEl,sx,sy,sw,sh,x,y,w,h);
			}
		}
		return canvas.toDataURL('image/png',quality)
	}else{

		let pixWidth = Math.ceil(width / sliceXCount)
		let pixHeight = Math.ceil(height / sliceYCount)

		pixWidth = Math.max(pixWidth,1)
		pixHeight = Math.max(pixHeight,1)

		width = sliceXCount * pixWidth
		height = sliceYCount * pixHeight

		// console.log(pixWidth,pixHeight,sliceXCount,sliceYCount)
		// console.log(width,height)

		canvas.width = width
		canvas.height = height
		
		ctx.drawImage(imageEl,0,0,width,height)

		let pixel = ctx.getImageData(0, 0, width, height);
		let pixelData = pixel.data;


		let outputPixel = ctx.createImageData(width, height);
		let outputPixelData = outputPixel.data;

		for(let hIndex = 0;hIndex<height;hIndex++){
			for(let wIndex = 0;wIndex<width;wIndex++){
				let indexPix = hIndex * width + wIndex;

				//原本所属小块
				const oldSliceXIndex = Math.floor(wIndex / pixWidth);
				const oldSliceYIndex = Math.floor(hIndex / pixHeight);

				//新的分组的所在位置
				const splitX = oldSliceXIndex % splitCount;
				const splitY = oldSliceYIndex % splitCount;

				//小块内位置
				const splitXPix = wIndex % pixWidth;
				const splitYPix = hIndex % pixHeight;

				// console.log(splitXPix,splitYPix)

				//新的分组所在位置 + 分组内小块位置
				// const y = wIndex / width  * sliceXMinCount;
				// if(/\./.test(y))console.log(y)

				// hIndex / height * sliceYMinCount 存在运算精度导致的抖动

				const wScale = wIndex / width;
				const hScale = hIndex / height;

				const sliceSplitX = wScale * fixNumA * sliceXMinCount;
				const sliceSplitY = hScale * fixNumA * sliceYMinCount;

				const sliceSplitXFloor = Math.floor(sliceSplitX/fixNumB);
				const sliceSplitYFloor = Math.floor(sliceSplitY/fixNumB);

				const newSplitX = width  * splitX / splitCount + sliceSplitXFloor * pixWidth;
				const newSplitY = height * splitY / splitCount + sliceSplitYFloor * pixHeight;


				// if(wIndex === 20)
				// if(hIndex === 310 ||hIndex === 311 || hIndex === 312 || hIndex === 313 || hIndex === 314 || hIndex === 315){
				// 	console.log(
				// 		hIndex,
				// 		newSplitY,
				// 		hScale,
				// 		hScale * sliceYMinCount,
				// 		Math.floor(hScale * sliceYMinCount)
				// 	)
				// }
				//
				const newW = newSplitX + splitXPix
				const newH = newSplitY + splitYPix
				// console.log(wIndex,hIndex,newW,newH)
				let newIndexPix = newH * width + newW
				// newIndexPix = Math.floor(newIndexPix)
				// console.log(newIndexPix)

				outputPixelData[ newIndexPix * 4 + 0 ] = pixelData[ indexPix * 4 + 0 ]
				outputPixelData[ newIndexPix * 4 + 1 ] = pixelData[ indexPix * 4 + 1 ]
				outputPixelData[ newIndexPix * 4 + 2 ] = pixelData[ indexPix * 4 + 2 ]
				outputPixelData[ newIndexPix * 4 + 3 ] = pixelData[ indexPix * 4 + 3 ]

			}
		}
		ctx.putImageData(outputPixel, 0, 0);

		// return canvas.toDataURL('image/jpeg',80)


		canvasOutput.width = naturalWidth;
		canvasOutput.height = naturalHeight;
		ctxOutput.drawImage(canvas,0,0,naturalWidth,naturalHeight)
		return canvasOutput.toDataURL('image/png',quality)
	}

	

}