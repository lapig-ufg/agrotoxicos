import {Component, ElementRef, ViewChild,ChangeDetectorRef, OnInit} from '@angular/core';


declare var $: any;
declare type JQuery = any;
declare type  jQuery = any;
declare type JQueryStatic = any;

declare type hash = any;
declare var $: JQuery;
declare var $: jQuery;
declare var jQuery;
declare var hash: any;
declare var $: JQueryStatic;
// use $


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit() {
   
 /*------------------------------*/
/*	Page loader
/*------------------------------*/


 $(window).load(function() {
	$(".loader-item").delay(500).fadeOut();
	$("#pageloader").delay(1000).fadeOut("slow");
	});


 /*------------------------------*/
/*	Slider
/*------------------------------*/

	setTimeout(function(){
		$('.home .flexslider').height($(window).height()).flexslider({
			slideshowSpeed: 6000,
			after : function(slider){
				$('.flexslider .big, .flexslider .middle, .flexslider .small').css('opacity',0);
				var next = $('.flex-active-slide', slider);
				sliderAnimate(next);
			}
		});
		$(window).resize(function(){
			$('.home .flexslider, .home .flexslider .slides img').height($(window).height());
		})
		sliderAnimate($('.flex-active-slide'));
		function sliderAnimate(next){
			if(next.hasClass('first')){
				$('.big', next).addClass('bounceInDown animated');
				$('.big', next).css('opacity','1');
				$('.big', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$('.big', next).removeClass('bounceInDown animated');
				});

				setTimeout(function(){
					$('.middle', next).addClass('bounceInRight animated').css('opacity','1');
					$('.middle', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$('.middle', next).removeClass('bounceInRight animated');
					});
					$('.small', next).addClass('bounceInLeft animated').css('opacity','1');
					$('.small', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$('.small', next).removeClass('bounceInLeft animated');
					});
				}, 400)
			}else if(next.hasClass('secondary')){

				$('.big', next).addClass('bounceInDown animated');
				$('.big', next).css('opacity','1');
				$('.big', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$('.big', next).removeClass('bounceInDown animated');
				});

				setTimeout(function(){
					$('.middle', next).addClass('bounceInRight animated').css('opacity','1');
					$('.middle', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$('.middle', next).removeClass('bounceInRight animated');
					});
					$('.small', next).addClass('bounceInLeft animated').css('opacity','1');
					$('.small', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$('.small', next).removeClass('bounceInLeft animated');
					});
				}, 400)
			}else if(next.hasClass('third')){
				$('.big', next).addClass('bounceInDown animated');
				$('.big', next).css('opacity','1');
				$('.big', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$('.big', next).removeClass('bounceInDown animated');
				});

				setTimeout(function(){
					$('.middle', next).addClass('bounceInRight animated').css('opacity','1');
					$('.middle', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$('.middle', next).removeClass('bounceInRight animated');
					});
					$('.small', next).addClass('bounceInLeft animated').css('opacity','1');
					$('.small', next).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$('.small', next).removeClass('bounceInLeft animated');
					});
				}, 400)
			}
		}

		$('.flex-next').addClass('fa fa-angle-right').text('');
		$('.flex-prev').addClass('fa fa-angle-left').text('');

		$('.home li > img').each(function(me){
			$(me).css('background-image', 'url(' + $(me).attr('src') + ')')
				   //.attr('src', '../images/1x1-blue.png')
				   .height($(window).height());
		});
	},0)


/*------------------------------*/
/*	related project carousel
/*------------------------------*/


	 $('.related-project-carousel').owlCarousel({
	 autoPlay:3000,
	 slideSpeed: 200,
	  items : 4,
	  itemsDesktop : [1199,4],
	  itemsDesktopSmall : [979,3],
	  stopOnHover:true,
	  pagination:false,
	  navigation : true,
	   navigationText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>"
      ],   

	});
	
	
/*------------------------------*/
/*	 Single Work carousel
/*------------------------------*/


     $("#single-work-slider").owlCarousel({
 
		navigation : false, // Show next and prev buttons
		slideSpeed : 400,
		pagination : false,
		singleItem:true,
		autoPlay: true,
		 navigationText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>"
      ] ,

 
	});


/*------------------------------*/
/*	 Parallax
/*------------------------------*/


	$(window).bind('load', function() {
		if(!onMobile)
		parallaxInit();
	});
	
	function parallaxInit() {
		$('#history').parallax("50%", 0.2);
		$('#facts').parallax("50%", 0.2);
		$('#cta').parallax("50%", 0.2);
		$('#skills').parallax("50%", 0.2);
		$('#video').parallax("50%", 0.2);
		$('#testimonials').parallax("50%", 0.2);
		$('#contact').parallax("50%", 0.2);
		$('#page-header').parallax("50%", 0.2);
		
		/*add as necessary*/
	}
		var onMobile = false;
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
			onMobile = true;
		}


/*-----------------------------------------------------
    Scroll Menu BG
-------------------------------------------------------*/
  
     /*$(window).scroll(function () {
         if ($("#header").offset().top > 50) {
             $("#header").addClass("menu-bg");
         } else {
            // $("#header").removeClass("menu-bg");
         }
     });


/*------------------------------*/
/* Testimonial Slider
/*------------------------------*/


	 $(".testimonials-carousel").owlCarousel({
	autoPlay: 5000,
	slideSpeed: 200,
	items: 1,
	itemsDesktop: [1199, 1],
	itemsDesktopSmall: [979, 1],
	itemsTablet: [768, 1],
	itemsMobile: [479, 1],
	autoHeight: true,
	navigation: false,
    });


/*------------------------------*/
/* Team Carousel
/*------------------------------*/


	$(".team-carousel").owlCarousel({
	
	items : 3, 
	 pagination : true,
	 navigation : false,
	 navigationText: [
	"<i class='fa fa-angle-left'></i>",
	"<i class='fa fa-angle-right'></i>"
	],   

	autoPlay: 3000,
	itemsDesktop : [1169,3],
	itemsDesktopSmall : [1024,3],
	itemsTablet : [640,2],
	itemsTabletSmall : false,
	itemsMobile : [560,1],
	// End Responsive Settings
	slideSpeed :1000

	});


/*------------------------------*/
/* Tab Carousel
/*------------------------------*/


     $(".tab-carousel").owlCarousel({
 
		navigation : true, // Show next and prev buttons
		slideSpeed : 400,
		pagination : false,
		singleItem:true,
		autoPlay: true,
		 navigationText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>"
      ] ,

 
	});


/*------------------------------*/
/* Mixitup portfolio
/*------------------------------*/


   jQuery('.work-grid').mixitup({
	targetSelector: '.mix',
	});



/*------------------------------*/
/* Magnific popup
/*------------------------------*/


$('.popup-image').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		mainClass: 'mfp-img-mobile',
		image: {
			verticalFit: true
		}
		
	});



/*------------------------------*/
/* Clients Carousel
/*------------------------------*/


	 $('.clients-carousel').owlCarousel({
	 autoPlay:3000,
	 slideSpeed: 200,
	  items : 6,
	  itemsDesktop : [1199,4],
	  itemsDesktopSmall : [979,3],
	  stopOnHover:true,
	  pagination:false,
	});



/*------------------------------*/
/*  Smooth scroll
/*------------------------------


      (function($) { "use strict";
		$(".scroll a[href^='#']").on('click', function(e) {
		   e.preventDefault();
		   var hash = this.hash;
		   $('html, body').stop().animate({
			   scrollTop: $(hash).offset().top}, 2000, 'easeOutExpo');
		});
		 })(jQuery);

		$('.collapse ul li a').click(function(){ 
		$('.navbar-toggle:visible').click();
	   });	


*/



/*------------------------------*/
/*  Scroll to top
/*------------------------------*/
	 
	$(window).scroll(function(me){
                    if ($(me).scrollTop() > 100) {
                        $('.scrollup').fadeIn();
                    } else {
                       // $('.scrollup').fadeOut();
                    }
                }); 
         
                $('.scrollup').click(function(){
                    $("html, body").animate({ scrollTop: 0 }, 2000);
                    return false;
                });
   

   
  }
  
  }
  