document.body.classList.add("loading");

window.onload = () => {

    let imgElement = document.getElementById('imageSrc');
    let inputElement = document.getElementById('fileInput');
    
    inputElement.onchange = () => {
        imgElement.src = URL.createObjectURL(event.target.files[0]);
    };

    imgElement.onload = function() {
        let image = cv.imread(imgElement);
        cv.imshow('imageCanvas', image);
        image.delete();
    };

    // circle detection & drawing code 
    document.getElementById('circlesButton').onclick = function() {
        this.disabled = true;
        document.body.classList.add("loading");
        
        // making source/processing/result images' matrices
        let srcMat = cv.imread('imageCanvas');
        let displayMat = srcMat.clone();
        let circlesMat = new cv.Mat();
        
        // to convert source image to grayscale image
        cv.cvtColor(srcMat, srcMat, cv.COLOR_RGBA2GRAY);
        
        // detecting the circles
        cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);
    
        // drawing the circles
        for (let i = 0; i < circlesMat.cols; ++i) {
            let x = circlesMat.data32F[i * 3];
            let y = circlesMat.data32F[i * 3 + 1];
            let radius = circlesMat.data32F[i * 3 + 2];
    
            let center = new cv.Point(x, y);
            cv.circle(displayMat, center, radius, [0, 0, 0, 255], 3);
        }
    
        // showing the result to user
        cv.imshow('imageCanvas', displayMat);
    
        // deleting the formed matrices
        srcMat.delete();
        displayMat.delete();
        circlesMat.delete();
    
        // Enabling the Button
        this.disabled = false;
        document.body.classList.remove("loading");
    };

    document.getElementById('downloadButton').onclick = function() {
        this.href = document.getElementById("imageCanvas").toDataURL();
        this.download = "image.png";
    };
}