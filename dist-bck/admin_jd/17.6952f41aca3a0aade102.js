(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"XF+e":function(n,l,e){"use strict";e.d(l,"a",function(){return u}),e.d(l,"b",function(){return a});var t=e("CcnG"),u=(e("yIz8"),e("Ip0R"),e("gIcY"),t["\u0275crt"]({encapsulation:2,styles:[],data:{}}));function a(n){return t["\u0275vid"](0,[t["\u0275qud"](402653184,1,{host:0}),(n()(),t["\u0275eld"](1,0,[[1,0],["host",1]],null,0,"textarea",[],null,null,null,null,null))],null,null)}},Zr1Z:function(n,l,e){"use strict";e.r(l);var t=e("CcnG"),u=function(){},a=e("pMnS"),i=e("Ip0R"),o=e("gIcY"),s=e("XF+e"),r=e("yIz8"),d=e("/onb"),p=e("Xyof"),g=e("Ok6J"),c=e("yTNM"),m=e("PSD3"),h=e.n(m),v=e("eUd/"),f=e("0b+V"),y=function(){function n(n,l,e,t,u,a){this.service=n,this.toastr=l,this.spinner=e,this.router=t,this.activeRoute=u,this.data={},this.pages={},this.ckEditorConfig={},this.datePickerConfig=a,this.ckEditorConfig=f.a}return n.prototype.ngOnInit=function(){this.token=localStorage.getItem("auth-token"),null==this.token&&this.router.navigate(["/login"]);var n=this.activeRoute.snapshot.params;""!=n.id&&"add"!=n.id&&(this.data={pagesId:n.id},this.getPageById(this.data)),document.getElementById("pages-link").classList.add("router-link-active");var l=new Date;this.datePickerConfig.maxDate={year:l.getFullYear(),month:l.getMonth()+1,day:l.getDate()},this.datePickerConfig.outsideDays="hidden"},n.prototype.ngOnDestroy=function(){document.getElementById("pages-link").classList.remove("router-link-active")},n.prototype.imageUpload=function(n){var l=this;"image/jpeg"!=n.target.files[0].type&&"image/png"!=n.target.files[0].type?this.toastr.error("Please upload .png/.jpeg image only"):(this.spinner.show(),this.S3upload(n.target.files[0]).then(function(n){l.pages.imageUrl=n,l.spinner.hide()},function(n){l.toastr.error(n.error.message),l.spinner.hide()}))},n.prototype.S3upload=function(n){var l=this;return new Promise(function(e,t){l.service.getSignedUrl(l.token,{contentType:n.type,type:"NEWS"}).then(function(u){var a=u;l.signedURL=a.data.signedURL,l.service.S3upload(l.signedURL,n).then(function(n){e(a.data.imageUrl)},function(n){l.toastr.error(n.error.message),t()})},function(n){l.toastr.error(n.error.message),t()})})},n.prototype.trimWhiteSpace=function(n){return""==n.trim()},n.prototype.removeHTMLTag=function(n){var l=n.replace(/<[^>]*>/g,"");return!!this.trimWhiteSpace(l)},n.prototype.validatePage=function(){return void 0==this.pages.title||""==this.pages.title?(this.toastr.error("Please provide title"),!1):this.trimWhiteSpace(this.pages.title)?(this.toastr.error("Please provide title"),!1):void 0!=this.pages.description&&""!=this.pages.description||(this.toastr.error("Please provide description"),!1)},n.prototype.deleteImage=function(){var n=this;h()({title:"Are you sure?",text:"You will not be able to recover this imaginary file!",type:"warning",showCancelButton:!0,confirmButtonText:"Yes",cancelButtonText:"No"}).then(function(l){l.value?(n.pages.imageUrl="",h()("Success","","success")):l.dismiss===h.a.DismissReason.cancel&&h()("Cancelled","","error")})},n.prototype.GetFormattedDate=function(n){var l=new Date(n);return l.getMonth()+1+"/"+l.getDate()+"/"+l.getFullYear()},n.prototype.submit=function(){var n=this;this.validatePage()&&(this.pages.pagesDate=this.GetFormattedDate(this.pages.pagesDate),this.pages.id?(this.spinner.show(),this.service.updatePage(this.token,this.pages).then(function(l){var e=l;n.spinner.hide(),n.router.navigate(["/pages"]),n.toastr.success(e.message)},function(l){n.spinner.hide(),n.toastr.error(400==l.status||409==l.status?l.error.message:"Server not responding.Please try again later.")})):(this.spinner.show(),this.service.createNews(this.token,this.pages).then(function(l){var e=l;n.spinner.hide(),n.router.navigate(["/pages"]),n.toastr.success(e.message)},function(l){n.spinner.hide(),n.toastr.error(400==l.status||409==l.status?l.error.message:"Server not responding.Please try again later.")})))},n.prototype.getPageById=function(n){var l=this;this.spinner.show(),this.service.getPageById(this.token,n).then(function(n){var e=n;l.pages=e.data.pagesDatails,l.pages.pagesDate=new Date(e.data.pagesDatails.pagesDate),l.spinner.hide()},function(n){l.spinner.hide(),l.toastr.error("Server not responding.Please try again later.")})},n}(),C=e("SZbH"),b=e("miAi"),P=e("ZYCi"),D=t["\u0275crt"]({encapsulation:0,styles:[[""]],data:{}});function k(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,1,"div",[["class","card-header header-pagetitle"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,[" Add Page "]))],null,null)}function I(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,1,"div",[["class","card-header header-pagetitle"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,[" Edit Page "]))],null,null)}function w(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,42,"div",[],null,null,null,null,null)),(n()(),t["\u0275and"](16777216,null,null,1,null,k)),t["\u0275did"](2,16384,null,0,i.m,[t.ViewContainerRef,t.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),t["\u0275and"](16777216,null,null,1,null,I)),t["\u0275did"](4,16384,null,0,i.m,[t.ViewContainerRef,t.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),t["\u0275eld"](5,0,null,null,37,"form",[["class","row"],["novalidate",""]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"submit"],[null,"reset"]],function(n,l,e){var u=!0;return"submit"===l&&(u=!1!==t["\u0275nov"](n,7).onSubmit(e)&&u),"reset"===l&&(u=!1!==t["\u0275nov"](n,7).onReset()&&u),u},null,null)),t["\u0275did"](6,16384,null,0,o.C,[],null,null),t["\u0275did"](7,4210688,null,0,o.r,[[8,null],[8,null]],null,null),t["\u0275prd"](2048,null,o.c,null,[o.r]),t["\u0275did"](9,16384,null,0,o.q,[[4,o.c]],null,null),(n()(),t["\u0275eld"](10,0,null,null,14,"div",[["class","col-md-12"]],null,null,null,null,null)),(n()(),t["\u0275eld"](11,0,null,null,13,"div",[["class","form-group"]],null,null,null,null,null)),(n()(),t["\u0275eld"](12,0,null,null,3,"label",[["for","title"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["Title"])),(n()(),t["\u0275eld"](14,0,null,null,1,"span",[["class","required"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["*"])),(n()(),t["\u0275eld"](16,0,null,null,8,"div",[["class","input-group"]],null,null,null,null,null)),(n()(),t["\u0275eld"](17,0,null,null,7,"input",[["class","form-control"],["maxlength","250"],["name","title"],["placeholder","Title"],["type","text"]],[[1,"maxlength",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],function(n,l,e){var u=!0,a=n.component;return"input"===l&&(u=!1!==t["\u0275nov"](n,18)._handleInput(e.target.value)&&u),"blur"===l&&(u=!1!==t["\u0275nov"](n,18).onTouched()&&u),"compositionstart"===l&&(u=!1!==t["\u0275nov"](n,18)._compositionStart()&&u),"compositionend"===l&&(u=!1!==t["\u0275nov"](n,18)._compositionEnd(e.target.value)&&u),"ngModelChange"===l&&(u=!1!==(a.pages.title=e)&&u),u},null,null)),t["\u0275did"](18,16384,null,0,o.d,[t.Renderer2,t.ElementRef,[2,o.a]],null,null),t["\u0275did"](19,540672,null,0,o.k,[],{maxlength:[0,"maxlength"]},null),t["\u0275prd"](1024,null,o.m,function(n){return[n]},[o.k]),t["\u0275prd"](1024,null,o.n,function(n){return[n]},[o.d]),t["\u0275did"](22,671744,null,0,o.s,[[2,o.c],[6,o.m],[8,null],[6,o.n]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,o.o,null,[o.s]),t["\u0275did"](24,16384,null,0,o.p,[[4,o.o]],null,null),(n()(),t["\u0275eld"](25,0,null,null,14,"div",[["class","col-md-12"]],null,null,null,null,null)),(n()(),t["\u0275eld"](26,0,null,null,13,"div",[["class","form-group"]],null,null,null,null,null)),(n()(),t["\u0275eld"](27,0,null,null,3,"label",[["for","title"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["Description"])),(n()(),t["\u0275eld"](29,0,null,null,1,"span",[["class","required"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["*"])),(n()(),t["\u0275eld"](31,0,null,null,8,"div",[["class","input-group"]],null,null,null,null,null)),(n()(),t["\u0275eld"](32,0,null,null,7,"ckeditor",[["debounce","500"],["name","description"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"]],function(n,l,e){var t=!0;return"ngModelChange"===l&&(t=!1!==(n.component.pages.description=e)&&t),t},s.b,s.a)),t["\u0275did"](33,13287424,null,2,r.b,[t.NgZone],{config:[0,"config"],readonly:[1,"readonly"],debounce:[2,"debounce"]},null),t["\u0275qud"](603979776,1,{toolbarButtons:1}),t["\u0275qud"](603979776,2,{toolbarGroups:1}),t["\u0275prd"](1024,null,o.n,function(n){return[n]},[r.b]),t["\u0275did"](37,671744,null,0,o.s,[[2,o.c],[8,null],[8,null],[6,o.n]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,o.o,null,[o.s]),t["\u0275did"](39,16384,null,0,o.p,[[4,o.o]],null,null),(n()(),t["\u0275eld"](40,0,null,null,2,"div",[["class","col-md-12"]],null,null,null,null,null)),(n()(),t["\u0275eld"](41,0,null,null,1,"button",[["class","btn btn-outline-dark"],["type","button"]],null,[[null,"click"]],function(n,l,e){var t=!0;return"click"===l&&(t=!1!==n.component.submit()&&t),t},null,null)),(n()(),t["\u0275ted"](-1,null,["Submit"]))],function(n,l){var e=l.component;n(l,2,0,!e.pages.id),n(l,4,0,e.pages.id),n(l,19,0,"250"),n(l,22,0,"title",e.pages.title),n(l,33,0,e.ckEditorConfig,!1,"500"),n(l,37,0,"description",e.pages.description)},function(n,l){n(l,5,0,t["\u0275nov"](l,9).ngClassUntouched,t["\u0275nov"](l,9).ngClassTouched,t["\u0275nov"](l,9).ngClassPristine,t["\u0275nov"](l,9).ngClassDirty,t["\u0275nov"](l,9).ngClassValid,t["\u0275nov"](l,9).ngClassInvalid,t["\u0275nov"](l,9).ngClassPending),n(l,17,0,t["\u0275nov"](l,19).maxlength?t["\u0275nov"](l,19).maxlength:null,t["\u0275nov"](l,24).ngClassUntouched,t["\u0275nov"](l,24).ngClassTouched,t["\u0275nov"](l,24).ngClassPristine,t["\u0275nov"](l,24).ngClassDirty,t["\u0275nov"](l,24).ngClassValid,t["\u0275nov"](l,24).ngClassInvalid,t["\u0275nov"](l,24).ngClassPending),n(l,32,0,t["\u0275nov"](l,39).ngClassUntouched,t["\u0275nov"](l,39).ngClassTouched,t["\u0275nov"](l,39).ngClassPristine,t["\u0275nov"](l,39).ngClassDirty,t["\u0275nov"](l,39).ngClassValid,t["\u0275nov"](l,39).ngClassInvalid,t["\u0275nov"](l,39).ngClassPending)})}var R=t["\u0275ccf"]("app-add-pages",y,function(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,3,"app-add-pages",[],null,null,null,w,D)),t["\u0275prd"](4608,null,d.a,p.a,[]),t["\u0275prd"](512,null,g.a,g.a,[]),t["\u0275did"](3,245760,null,0,y,[c.a,C.j,b.c,P.o,P.a,g.a],null,null)],function(n,l){n(l,3,0)},null)},{},{},[]),S=e("4lDY"),T=e("qcfG"),x=e("xaNE"),M=e("FNNE"),F=e("gW6t"),N=e("u4HF"),U=e("aq8m"),E=e("iCtU"),j=e("Ovjw"),L=function(){},Y=e("LKjY"),q=e("bt6x"),B=e("0XGt"),A=e("PsaP"),G=e("nhl2"),V=e("InZo"),W=e("C9m0"),Z=e("+NDo"),O=e("4WQT"),X=e("wtSO"),_=e("gpiN"),H=e("NlYj"),J=e("neuq"),z=e("y+WT"),K=e("MVL9"),Q=e("j2fZ");e.d(l,"AddPagesModuleNgFactory",function(){return $});var $=t["\u0275cmf"](u,[],function(n){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[a.a,R,S.a,T.a,x.a,M.a,F.a,N.a,U.a]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,i.o,i.n,[t.LOCALE_ID,[2,i.A]]),t["\u0275mpd"](4608,o.D,o.D,[]),t["\u0275mpd"](4608,E.a,E.a,[t.ComponentFactoryResolver,t.Injector,j.a]),t["\u0275mpd"](1073742336,i.c,i.c,[]),t["\u0275mpd"](1073742336,P.s,P.s,[[2,P.y],[2,P.o]]),t["\u0275mpd"](1073742336,L,L,[]),t["\u0275mpd"](1073742336,r.a,r.a,[]),t["\u0275mpd"](1073742336,o.A,o.A,[]),t["\u0275mpd"](1073742336,o.j,o.j,[]),t["\u0275mpd"](1073742336,Y.a,Y.a,[]),t["\u0275mpd"](1073742336,q.a,q.a,[]),t["\u0275mpd"](1073742336,B.a,B.a,[]),t["\u0275mpd"](1073742336,A.a,A.a,[]),t["\u0275mpd"](1073742336,G.a,G.a,[]),t["\u0275mpd"](1073742336,V.a,V.a,[]),t["\u0275mpd"](1073742336,W.a,W.a,[]),t["\u0275mpd"](1073742336,Z.b,Z.b,[]),t["\u0275mpd"](1073742336,O.a,O.a,[]),t["\u0275mpd"](1073742336,X.a,X.a,[]),t["\u0275mpd"](1073742336,_.a,_.a,[]),t["\u0275mpd"](1073742336,H.a,H.a,[]),t["\u0275mpd"](1073742336,J.a,J.a,[]),t["\u0275mpd"](1073742336,z.b,z.b,[]),t["\u0275mpd"](1073742336,K.a,K.a,[]),t["\u0275mpd"](1073742336,Q.a,Q.a,[]),t["\u0275mpd"](1073742336,v.b,v.b,[]),t["\u0275mpd"](1073742336,u,u,[]),t["\u0275mpd"](1024,P.m,function(){return[[{path:"",component:y}]]},[])])})}}]);