import { Component, Input, OnInit } from '@angular/core';
import Dynamsoft from 'dwt';
import { WebTwain } from 'dwt/dist/types/WebTwain';


@Component({
  selector: 'app-dwt',
  templateUrl: './dwt.component.html',
  styleUrls: ['./dwt.component.scss']
})
export class DwtComponent implements OnInit {
  DWObject!: WebTwain;
  selectSources!: HTMLSelectElement;
  containerId = 'dwtcontrolContainer';
  bWASM = false;
  deviceList:any[] =[];
$evevt: any;

  constructor() { }

 

  ngOnInit(): void {
    Dynamsoft.DWT.Containers = [{ WebTwainId: 'dwtObject', ContainerId: this.containerId, Width: '100%', Height: '100%' }];
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => { this.OnReady(); });
    Dynamsoft.DWT.ResourcesPath = '/assets/dwt-resources';
	  Dynamsoft.DWT.ProductKey = "t0185SwUAABKO6MFJyTL5D3liNVnGuB5C2+TDL5kQjR0PmU1VWcNhPfupi9Nf+wjQpfqA7+8GnDftOmXyrdBk/oGK6GxJfKp0n24tLY/R6nkt1doHDdFiHtIEPlstkU/hnOcvKXXN4Qg8E6D7guwALJDLOQAv3V5bhgLgHqAdIHe6CXwtsp7aGlddo1/bS00nD3Dq9U67sdc47br+6wy7GoYo7/B3yQDslAuAe4B2gNyAAnBeAa/6Ac1HCYw=";
    Dynamsoft.DWT.Load();
  }

 
 acquire()
{
   const ele = document.getElementById('sources') as HTMLSelectElement
   const cIndex = ele.selectedIndex;
    if (cIndex < 0)
        return;

    var i, iPixelType = 0;
    for (i = 0; i < 3; i++) {
      const elee =document.getElementsByName('PixelType').item(i) as HTMLInputElement
        if (elee.checked == true)
            iPixelType = i;
    }

    const showui = document.getElementById('ShowUI') as HTMLInputElement
    const Feeder =  document.getElementById('ADF') as HTMLSelectElement
    this.DWObject.SelectDeviceAsync(this.deviceList[cIndex]).then( () => {
        return this.DWObject.AcquireImageAsync({
            IfShowUI: showui.checked,
            PixelType: iPixelType,
            IfDisableSourceAfterAcquire: true // Scanner source will be disabled/closed automatically after the scan.
        });
    }).then( () => {
       
        this.checkErrorStringWithErrorCode(0, 'Successful.'); //checkErrorString();
        return this.DWObject.CloseSourceAsync();
    }).catch(function (exp) {

        alert(exp.message);
    });
}

  openImage(): void {
    if (!this.DWObject)
      this.DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
    this.DWObject.IfShowFileDialog = true;
    /**
     * Note, this following line of code uses the PDF Rasterizer which is an extra add-on that is licensed seperately
     */
    this.DWObject.Addon.PDF.SetConvertMode(Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL);
    this.DWObject.LoadImageEx("", Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL,
      function () {
        //success
      }, function () {
        //failure
      });
  }

  btnRotateLeft() {
    if (!this.checkIfImagesInBuffer()) {
        return;
    }
    this.DWObject.RotateLeft( this.DWObject.CurrentImageIndexInBuffer);
    if (this.checkErrorString()) {
        return;
    }
}

checkIfImagesInBuffer() {
  if (this.DWObject.HowManyImagesInBuffer == 0) {
      return false;
  }
  else
      return true;
}

btnMirror_onclick() {
  if (!this.checkIfImagesInBuffer()) {
      return;
  }
  this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer);
  if (this.checkErrorString()) {
      return;
  }
}

btnFlip_onclick() {
  if (!this.checkIfImagesInBuffer()) {
      return;
  }
  this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer);

  if (this.checkErrorString()) {
      return;
  }
}
btnPreImage_onclick() {
  if (!this.checkIfImagesInBuffer()) {
      return;
  }
  this.DWObject.Viewer.previous();
}

btnNextImage_wheel() {
  if (this.DWObject.HowManyImagesInBuffer != 0)
      this.btnNextImage_onclick()
}

btnNextImage_onclick() {
  if (!this.checkIfImagesInBuffer()) {
      return;
  }
  this.DWObject.Viewer.next();
}

btnPreImage() {
  if (!this.checkIfImagesInBuffer()) {
      return;
  }
  this.DWObject.Viewer.previous();
 
}


saveUploadImage(type: string){
	if(type=='local'){
		this.btnSave_onclick();
		}else if(type=='server'){
		this.btnSave_onclick()
		}
}



OnReady(){
  this.DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer'); 
  if (this.DWObject){
    if(this.DWObject.ErrorCode ==0){
      const thumbnailViewer = this.DWObject.Viewer.createThumbnailViewer();
      thumbnailViewer.size = "300px";
      thumbnailViewer.showPageNumber= true ;
      thumbnailViewer.selectedImageBackground = thumbnailViewer.background;
      thumbnailViewer.selectedImageBorder = "solid 2px #FE8E14"; 
      thumbnailViewer.hoverBorder = "solid 2px #FE8E14";
      thumbnailViewer.placeholderBackground="#D1D1D1"; 
      thumbnailViewer.show();
      thumbnailViewer.hoverBackground = thumbnailViewer.background;
      thumbnailViewer.on("click", this.Dynamsoft_OnMouseClick);
      thumbnailViewer.on('dragdone', this.Dynamsoft_OnIndexChangeDragDropDone);
      thumbnailViewer.on("keydown", this.Dynamsoft_OnKeyDown);
      this.DWObject.Viewer.on("wheel", this.Dynamsoft_OnMouseWheel);  //H5 only
      this.DWObject.Viewer.on("OnPaintDone", this.Dynamsoft_OnMouseWheel);   //A
      this.DWObject.Viewer.allowSlide = false;
      this.DWObject.IfAllowLocalCache = true;
      this.DWObject.ImageCaptureDriverType = 4;
      this.bWASM = Dynamsoft.Lib.env.bMobile || !Dynamsoft.DWT.UseLocalService;
      this.selectSources = <HTMLSelectElement>document.getElementById("sources");
      if(!Dynamsoft.Lib.env.bMobile){
        this.DWObject.GetDevicesAsync().then((devices)=>{
          this.selectSources.options.length = 0;    
          for (var i = 0; i < devices.length; i++) { // Get how many sources are installed in the system
              this.selectSources.options.add(new Option(devices[i].displayName, i.toString())); // Add the sources in a drop-down list
              this.deviceList.push(devices[i]);
            }
          }).catch(function (exp) {
            alert(exp.message);
          });
      }		
     
    }
  }
}


RemoveCurrentImage() {
  this.DWObject.RemoveImage(this.DWObject.CurrentImageIndexInBuffer);
  if (this.DWObject.HowManyImagesInBuffer == 0)
      this.DWObject.RemoveImage(0);
  Dynamsoft.DWT.CloseDialog();
}

RemoveAllImages() {
  this.DWObject.RemoveAllImages();
  this.DWObject.RemoveImage(0);

  Dynamsoft.DWT.CloseDialog();
}

updatePageInfo(){
  const ele = document.getElementById("DW_TotalImage")  as HTMLInputElement
  if (ele ){
    let e = parseFloat(ele.value)
    e = this.DWObject.HowManyImagesInBuffer ;
  }
  const ele2 = document.getElementById("DW_CurrentImage") as HTMLInputElement
  if (ele2){
   let e2 = parseFloat(ele2.value)
   e2 =this.DWObject.CurrentImageIndexInBuffer + 1
  }
}

Dynamsoft_OnMouseClick() {
  this.updatePageInfo();
}
Dynamsoft_OnIndexChangeDragDropDone(event: any) {
  this.updatePageInfo();
}
Dynamsoft_OnKeyDown() {
  this.updatePageInfo();
}

 Dynamsoft_OnMouseWheel() {
  this.updatePageInfo();
}


btnSave_onclick() {
  if (!this.checkIfImagesInBuffer()) {
      return;
  }

  var fileType = document.getElementById("fileType") as HTMLInputElement;
  var strPageType_save = fileType.value;

  this.DWObject.IfShowFileDialog = true;
  var _txtFileNameforSave = document.getElementById("txt_fileName") as HTMLInputElement;
  if (_txtFileNameforSave)
      _txtFileNameforSave.className = "";
 let bSave : any;

  var strFilePath = _txtFileNameforSave.value + "." + strPageType_save;

  var OnSuccess = function () {
      checkErrorStringWithErrorCode(0, "Successful.");
  };

  var OnFailure= function (errorCode: number, errorString: string) {
      checkErrorStringWithErrorCode(errorCode, errorString);
  };

  var allPages = document.getElementById("AllPages") as HTMLInputElement  ;
  var vAsyn = false;
  if (allPages?.checked == true) {
       if (strPageType_save == "tif") {  //tiff
              vAsyn = true;
              bSave = this.DWObject.SaveAllAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
          }
          else if (strPageType_save == "pdf") { //pdf
              vAsyn = true;
              bSave = this.DWObject.SaveAllAsPDF(strFilePath, OnSuccess, OnFailure);
          }
  }  else {
      switch (strPageType_save) {
          case "bmp": bSave = this.DWObject.SaveAsBMP(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
          case "jpg": bSave = this.DWObject.SaveAsJPEG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
          case "tif": bSave = this.DWObject.SaveAsTIFF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
          case "png": bSave = this.DWObject.SaveAsPNG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
          case "pdf": bSave = this.DWObject.SaveAsPDF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
      }
  }

  if (vAsyn == false) {
      //if (bSave)
          //appendMessage('<b>Save Image: </b>');
      if (this.checkErrorString()) {
          return;
      }
  }
}


checkErrorStringWithErrorCode(errorCode: number, responseString: string | undefined) {
  if (errorCode == 0) {
      return true;
  }
  if (errorCode == -2115) //Cancel file dialog
      return true;
  else {
      if (errorCode == -2003) {
          var ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
      }  
      return false;
  }
}

checkErrorString() {
  return this.checkErrorStringWithErrorCode(this.DWObject.ErrorCode, this.DWObject.ErrorString);
}



}



function checkErrorStringWithErrorCode(arg0: number, arg1: string) {
  throw new Error('Function not implemented.');
}

