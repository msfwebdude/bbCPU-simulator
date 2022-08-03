
	function formatNumber(n){
		if(!Number.isNaN(n)){
			return ('00000000' + n.toString(2)).substr(-8,8);
		}
		else {
			return n;
		}

	}
	function createMemoryArray(arraySize){
		let rtv = [];
		for (let i = 0; i < arraySize; i++) {
			rtv.push(Math.floor((Math.random() * 255)))
		}
		return rtv;
	}
	function resetAll(){
		bus = 0;
		self.busValue.innerHTML = formatNumber(0);

		aRegister.value       = 0;
		bRegister.value       = 0;
		outputRegister.value  = 0;
		programCounter.value  = 0;
		memAddrRegister.value = 0;
		instrRegister.value   = 0;
		aluRegister.carryFlag = false;

		clock.tick();
	}


	class Clock extends EventTarget {
		constructor(){
			super();
		}
		
		tick(){
			this.dispatchEvent(new CustomEvent("tick"));
		}
	}

	class CpuRegister {

		mLoadFlag   = undefined;
		mLoadButton = undefined;
		mOutFlag    = undefined;
		mOutButton  = undefined;
		mValue      = undefined;
		mValueDiv   = undefined;

		constructor(valueDiv){
			this.mLoadFlag = false;
			this.mValue    = Math.floor((Math.random() * 255));
			this.mValueDiv = valueDiv;
		}

		get value() { return this.mValue; }
		set value(neoValue) { this.mValue = neoValue; }

		get loadFlag() { return this.mLoadFlag; }
		set loadFlag(neoValue) { this.mLoadFlag = neoValue; }

		get outFlag() { return this.mOutFlag; }
		set outFlag(neoValue) { this.mOutFlag = neoValue; }


		clockTick = () => {
			if(this.mLoadFlag == true){
				this.mValue = bus;
				this.mLoadFlag = false;
				this.mLoadButton.className = 'buttonInactive';
			}

			if(this.mOutFlag == true){
				bus = this.mValue;
				self.busValue.innerHTML = formatNumber(bus);
				this.mOutFlag = false;
				this.mOutButton.className = 'buttonInactive';
			}

			if(this.mValueDiv){
				this.mValueDiv.innerHTML = formatNumber(this.mValue);
			}
		}
		
		clickLoad = (button) => {
			this.mLoadButton = button;
			if(this.mLoadFlag){
				// unload
				this.mLoadFlag = false;
				this.mLoadButton.className = 'buttonInactive';
			}
			else {
				// load
				this.mLoadFlag = true;
				this.mLoadButton.className = 'buttonActive';
			}
		}

		clickOut = (button) => {
			this.mOutButton = button;
			if(this.mOutFlag){
				// unload
				this.mOutFlag = false;
				this.mOutButton.className = 'buttonInactive';
			}
			else {
				// load
				this.mOutFlag = true;
				this.mOutButton.className = 'buttonActive';
			}
		}
	}

	class ALU extends CpuRegister {

		mSubtract   = undefined;
		mSubButton  = undefined;
		mCarryFlag  = undefined;
		mCarryDiv   = undefined;

		constructor(valueDiv, carryDiv){
			super(valueDiv);

			this.mCarryDiv  = carryDiv;
			this.mSubtract  = false;
			this.mCarryFlag = false;

			this.clockTick = () => {
				if(this.mSubtract){
					this.mValue = aRegister.value - bRegister.value;
				}
				else {
					this.mValue = aRegister.value + bRegister.value;
				}

				if(this.mValue > 0xFF) {
					this.mValue    &= 0xFF;
					this.mCarryFlag = true;
				}

				if(this.mOutFlag == true){
					bus = this.mValue;
					self.busValue.innerHTML = formatNumber(bus);
					this.mOutFlag = false;
					this.mOutButton.className = 'buttonInactive';
				}

				if(this.mValueDiv){
					this.mValueDiv.innerHTML = formatNumber(this.mValue);
				}
				console.log(this.mCarryDiv);
				if(this.mCarryDiv){
					this.mCarryDiv.innerHTML = (this.mCarryFlag == true) ? '&#x2B24;': '&#x2B58;';
				}

			};
		}


		get subtract() { return this.mSubtract; }
		set subtract(neoSubtract) { this.mSubtract = neoSubtract; }

		get carryFlag() { return this.mCarryFlag; }
		set carryFlag(neoCarryFlag) { this.mCarryFlag = neoCarryFlag; }
		
		clickSubtract = (button) => {
			this.mSubButton = button;
			if(this.mSubtract){
				// unload
				this.mSubtract = false;
				this.mSubButton.className = 'buttonInactive';
			}
			else {
				// load
				this.mSubtract = true;
				this.mSubButton.className = 'buttonActive';
			}
		}	
	}		
	

	class ProgramCounter extends CpuRegister {

		mJumpFlag    = undefined;
		mJumpButton  = undefined;
		mCountEnable = undefined;
		mCountButton = undefined;

		constructor(valueDiv){
			super(valueDiv);

			this.mJumpFlag    = false;
			this.mCountEnable = false;

			// reprogram the clock tick to do more
			this.clockTick = () => {
				if(this.mJumpFlag == true){
					this.mValue = bus;
					this.mJumpFlag = false;
					this.mJumpButton.className = 'buttonInactive';
				}

				if(this.mCountEnable == true){
					this.mValue++;
					this.mCountEnable = false;
					this.mCountButton.className = 'buttonInactive';
				}
	
				if(this.mOutFlag == true){
					bus = this.mValue;
					self.busValue.innerHTML = formatNumber(bus);
					this.mOutFlag = false;
					this.mOutButton.className = 'buttonInactive';
				}
	
				if(this.mValueDiv){
					this.mValueDiv.innerHTML = formatNumber(this.mValue);
				}
			};

		}

		clickJump = (button) => {
			this.mJumpButton = button;
			if(this.mJumpFlag){
				// unload
				this.mJumpFlag = false;
				this.mJumpButton.className = 'buttonInactive';
			}
			else {
				// load
				this.mJumpFlag = true;
				this.mJumpButton.className = 'buttonActive';
			}
		}

		clickCount = (button) => {
			this.mCountButton = button;
			if(this.mCountEnable){
				// unload
				this.mCountEnable = false;
				this.mCountButton.className = 'buttonInactive';
			}
			else {
				// load
				this.mCountEnable = true;
				this.mCountButton.className = 'buttonActive';
			}
		}
	}


	class OutputRegister extends CpuRegister {

		mDisplayDiv = undefined;

		constructor(valueDiv, displayDiv){
			super(valueDiv);

			this.mDisplayDiv = displayDiv;

			// reprogram the clock tick to do more
			this.clockTick = () => {
				if(this.mLoadFlag == true){
					this.mValue = bus;
					this.mLoadFlag = false;
					this.mLoadButton.className = 'buttonInactive';
				}
		
				if(this.mValueDiv){
					this.mValueDiv.innerHTML = formatNumber(this.mValue);
				}
		
				if(this.mDisplayDiv){
					this.mDisplayDiv.innerHTML = ('000' + this.mValue.toString()).substr(-3,3);
				}
				
			};

		}


	}


	class RamMemory extends CpuRegister {
		
		constructor(valueDiv){
			super(valueDiv);

			this.clockTick = () => {
				if(this.mLoadFlag == true){
					ram[memAddrRegister.value] = bus;
					this.mLoadFlag = false;
					this.mLoadButton.className = 'buttonInactive';
				}
	
				if(this.mOutFlag == true){
					bus = ram[memAddrRegister.value];
					self.busValue.innerHTML = formatNumber(bus);
					this.mOutFlag = false;
					this.mOutButton.className = 'buttonInactive';
				}
	
				if(this.mValueDiv){
					this.mValueDiv.innerHTML = formatNumber(ram[memAddrRegister.value]);
				}
			};
		}
	}

	let clock = new Clock();
	let bus   = 0x4F;
	let ram   = [];

	let aRegister       = new CpuRegister(self.aValue);
	let bRegister       = new CpuRegister(self.bValue);
	let aluRegister     = new ALU(self.aluValue, self.carryIndicator);
	let programCounter  = new ProgramCounter(self.pValue);
	let outputRegister  = new OutputRegister(self.oValue, self.dValue);
	let memAddrRegister = new CpuRegister(self.mValue);
	let ramMemory       = new RamMemory(self.rValue);
	let instrRegister   = new CpuRegister(self.iValue);
	let inRegister      = new CpuRegister(self.nValue);
			
	clock.addEventListener("tick", aRegister.clockTick);
	clock.addEventListener("tick", bRegister.clockTick);
	clock.addEventListener("tick", aluRegister.clockTick);
	clock.addEventListener("tick", programCounter.clockTick);
	clock.addEventListener("tick", outputRegister.clockTick);
	clock.addEventListener("tick", memAddrRegister.clockTick);
	clock.addEventListener("tick", ramMemory.clockTick);
	clock.addEventListener("tick", instrRegister.clockTick);
	clock.addEventListener("tick", inRegister.clockTick);

	ram = createMemoryArray(255);

	self.busValue.innerHTML = formatNumber(bus);
	self.busValue.addEventListener('click', () => {
			let nv = prompt("Enter new decimal Bus value", bus.toString());
			if(nv != ""){
				bus = parseInt(nv);
				self.busValue.innerHTML = formatNumber(bus);
			}
		}
	);

	// set dynamic content
	const dateCurrent = new Date();
	self.currentYear.innerHTML = dateCurrent.getFullYear();

	self.setTimeout(clock.tick(), 20);


	