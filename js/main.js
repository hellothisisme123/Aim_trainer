const outer_target = document.querySelector('.outer_target'),
      mid_target = document.querySelector('.mid_target'),
      inner_target = document.querySelector('.inner_target'),
      point_selector = document.querySelector('.point_value'),
      container = document.querySelector('.container'),
      autoclicker = document.querySelector('.autoclicker'),
      toggle_button_container = document.querySelector('.toggle_button_container')

let points = 0;

window.onload = () => {
    random_pos()
}

window.onresize = () => {
    random_pos()
}

const point_increase = (value) => {
    points += value
    point_selector.innerHTML = points
    if (document.querySelector('.point_label')) document.querySelector('.point_label').remove()

    let point_label = document.createElement('div')
    point_label.innerHTML = value
    point_label.classList.add('point_label')

    //animates the position
    // console.log(`(${outer_target.style.left}, ${outer_target.style.top}`)
    let startX = outer_target.style.left,
        startY = outer_target.style.top,
        displaceX = random_min_max_int(-25, 25),
        displaceY = random_min_max_int(-50, -100)
    point_label.style.left = startX
    point_label.style.top = startY
    container.appendChild(point_label)
    
    const duration = 2000 
    setTimeout(() => {
        point_label.remove()
    }, duration)
    anime({
        targets: '.point_label',
        translateX: `${displaceX}px`,
        translateY: `${displaceY}px`,
        opacity: 0,
        duration: duration,
        easing: 'cubicBezier(.17,.67,.28,.98)'
    })

    document.documentElement.style.setProperty('--colors_hue', random_min_max_int(0, 360))
    document.documentElement.style.setProperty('--colors_saturation', `${random_min_max_int(50, 90)}%`)
    document.documentElement.style.setProperty('--colors_luminosity', `${random_min_max_int(25, 100)}%`)
}

const random_pos = () => {
    let containerX = container.clientWidth,
        containerY = container.clientHeight,
        target_size = outer_target.clientWidth,
        nextXPos = random_min_max_int(0 + target_size/2, containerX - target_size/2),
        nextYPos = random_min_max_int(0 + target_size/2, containerY - target_size/2)
    
    if (document.querySelector('nex_pos_marker')) document.querySelector('nex_pos_marker').remove(); 
    let marker = document.createElement('div')
    marker.classList.add('nex_pos_marker')
    marker.style.left = `${nextXPos}px`
    marker.style.top = `${nextYPos}px`
    container.appendChild(marker)
    setTimeout(() => {
        marker.remove()
    }, 200);

    outer_target.style.left = `${nextXPos}px`
    outer_target.style.top = `${nextYPos}px`
}

outer_target.addEventListener('click', (e) => {
    e.stopPropagation()
    point_increase(100)
    random_pos()
});

mid_target.addEventListener('click', (e) => {
    e.stopPropagation()
    point_increase(200)
    random_pos()
});

inner_target.addEventListener('click', (e) => {
    e.stopPropagation()
    point_increase(300)
    random_pos()
});

class slider {
    constructor(
        name,
        min,
        max,
        location,
        border_width,
        bind_unit
        // slider_selector,
    ) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.location = location;
        this.border_width = border_width;
        this.bind_unit = bind_unit;
        
        
        this.fullness = 0;
        this.min_max_differential = max - min
        this.bind = this.min_max_differential * this.fullness + this.min

        
        this.bind = 0;
        
        
        this.slider_selector = document.createElement('div');
        this.slider_selector.classList.add('slider_container')
        this.location.appendChild(this.slider_selector)
        
        this.slider_handle = document.createElement('div')
        this.slider_handle.classList.add('slider_handle')
        this.slider_selector.appendChild(this.slider_handle)

        this.slider_name_label = document.createElement('div')
        this.slider_name_label.classList.add('slider_name_label')
        this.slider_name_label.innerHTML = this.name;
        this.slider_selector.appendChild(this.slider_name_label)

        this.slider_value_label = document.createElement('div')
        this.slider_value_label.classList.add('slider_value_label')
        this.slider_value_label.innerHTML = `${this.min}${this.bind_unit}`;
        this.slider_selector.appendChild(this.slider_value_label)
        
        this.dragging = false;
        this.mouse_offset;
        this.sliderRect = this.slider_selector.getClientRects()
        
        this.slider_handle.addEventListener('mousedown', (e) => {
            this.dragging = true
        })
        
        window.addEventListener('mouseup', (e) => {
            this.dragging = false
        })

        window.addEventListener('mousemove', (e) => {
            if (this.dragging) {
                let slider_x = e.clientX - this.sliderRect[0].x
                
                if (e.clientX < this.sliderRect[0].x + this.border_width) slider_x = this.border_width
                else if (e.clientX > this.sliderRect[0].x + this.sliderRect[0].width - this.border_width) slider_x = this.sliderRect[0].width - this.border_width
                
                // -_-converts 0.05 to 0, 0.95 to 1, and everything in between-_- \\
                this.fullness = slider_x / this.sliderRect[0].width
                this.fullness -= 0.05
                this.fullness *= (10 / 9)

                this.min_max_differential = max - min
                this.bind = this.min_max_differential * this.fullness + this.min
                clearInterval(autoclick_interval)
                autoclick_interval = setInterval(() => {
                    if (autoclick_toggle.def_toggle) inner_target.click()
                }, this.bind);
                this.slider_value_label.innerHTML = `${parseInt(this.bind)}${this.bind_unit}`;

                this.slider_handle.style.left = `${slider_x}px`
            }
        })
    }   
}

const autoclick_slider = new slider('autoclick slider', 10, 1000, autoclicker, 16, 'ms')

let autoclick_interval;

class toggle_switch {
    constructor (
        def_toggle,
        location
    ) {
        this.def_toggle = def_toggle;
        this.location = location;

        let toggle_wrapper = document.createElement('div')
        toggle_wrapper.classList.add('toggle_btn_wrapper')
        location.appendChild(toggle_wrapper)

        let toggle_btn_btn = document.createElement('div')
        toggle_btn_btn.classList.add('toggle_btn_btn')
        toggle_wrapper.appendChild(toggle_btn_btn)

        if (this.def_toggle) toggle_btn_btn.style.left = '50%';
        else if (!this.def_toggle) toggle_btn_btn.style.left = '0%'
        

        toggle_btn_btn.addEventListener('click', (e) => {
            if (this.def_toggle) {
                this.def_toggle = false;
                toggle_btn_btn.style.left = '0%'
            } else if (!this.def_toggle) {
                this.def_toggle = true;
                toggle_btn_btn.style.left = '50%'
            }
        })        
    }
}

const autoclick_toggle = new toggle_switch(false, toggle_button_container)