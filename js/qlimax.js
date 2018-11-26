$(document).ready(function(){

    const parentApp = require('electron').remote;
    const { dialog } = require('electron').remote;
    var CasparCG = require("caspar-cg");
    var fs = require('fs');    
    var windowState = 'windowed';
    var eventData = null;
    var ccgConnection = null;

    // ccgConnect();




    $('.windowButtons .windowClose').on('click', function(){
        parentApp.getCurrentWindow().close();
    });

    $('.windowButtons .windowMinimize').on('click', function(){
        parentApp.getCurrentWindow().minimize();
    });

    
    $('.windowButtons .windowMaximize').on('click', function(){
        if(windowState == 'windowed'){
            parentApp.getCurrentWindow().maximize();
            windowState = 'maximized';
        }
        if(windowState == 'maximized'){
            parentApp.getCurrentWindow().unmaximize();
            windowState = 'windowed';
        }
    });

    $('[name=openFile]').on('click', openFile);

    
    $(document).on('click', '.gfx_2 a.list-group-item', function(e){
        var $this = $(this);
        ccgStart($this.attr('ccgFile'));
    });

    $(document).on('click', '.gfx_1 a.list-group-item [action=load]', function(e){
        var $this = $(this);
        var $file = $this.closest('.list-group-item').attr('ccgFile');
        ccgLoad($file);
    });
    $(document).on('click', '.gfx_1 a.list-group-item [action=play]', function(e){
        var $this = $(this);
        var $file = $this.closest('.list-group-item').attr('ccgFile');
        ccgPlay($file);
    });

    function openFile(){
        dialog.showOpenDialog();
        // console.log(selectedPaths);
        
    }

    function openFile () {
        dialog.showOpenDialog({ filters: [
          { name: 'json', extensions: ['json'] }
         ]}, function (fileNames) {       
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            fs.readFile(fileName, 'utf-8', function (err, data) {
                $('.gfx_2 a').remove();
                eventData = JSON.parse(data);
                ccgConnect();
                for (var name in eventData['content']['Lower Thirds']) {
                    $('.gfx_2').append('<a class="list-group-item" ccgFile="'+eventData['content']['Lower Thirds'][name]+'">'+name+'</a>');
                }
                for (var name in eventData['content']['Main Graphics']) {
                    $('.gfx_1').append('<a class="list-group-item" ccgFile="'+eventData['content']['Main Graphics'][name]+'">'+name+'<div class="float-right"><div class="btn btn-sm btn-warning" action="load">LOAD</div> <div class="btn btn-sm btn-success" action="play">PLAY</div></div></a>');
                }
            });
        }); 
       
    }


    function ccgConnect(){
        // alert(eventData['ccg']['ip']);
        // alert(eventData['ccg']['port']);
        ccgConnection = new CasparCG(eventData['ccg']['ip'], eventData['ccg']['port']);
        //HOSTED_VILLAIN

        ccgConnection.connect(function () {
            // ccg.info(function (err, serverInfo) {
            //     console.log(serverInfo);
            // });
        
            // ccgConnection.play("1-20", "HOSTED_VILLAIN");
        });
    };

    
    function ccgStart($file){
        ccgConnection.play("1-20", $file);
    };

    function ccgLoad($file){
        ccgConnection.load("1-20", $file);
    };
    function ccgPlay($file){
        ccgConnection.play("1-20");
    };

    

});