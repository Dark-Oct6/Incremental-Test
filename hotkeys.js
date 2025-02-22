// buy max (upg & IG)
let mIsHeld = false;
let pIsHeld = false;
let iIsHeld = false;
let mIntervalId;
let pIntervalId;
let iIntervalId;

// Function to be executed while the key is held down
function mRepeatedAction() {
  // Your repeated action here
  buyMax();
  infinityGenerators.buyMax();
}

// Function to be executed while the key is held down
function pRepeatedAction() {
    // Your repeated action here
    infinity.reset();
}

// Function to be executed while the key is held down
function iRepeatedAction() {
    // Your repeated action here
    iris.reset();
}

// Event listener for keydown event
document.addEventListener("keydown", function(event) {
  // Check if the pressed key is the one you want to track (e.g., "m")
  if (event.key === "m") {
    // Check if the key is not already held down to avoid starting multiple intervals for the same key
    if (!mIsHeld) {
      mIsHeld = true;
      mIntervalId = setInterval(mRepeatedAction, 50); // Adjust the interval time (in milliseconds) as per your requirement
    }
  }
  if (event.key === "p") {
    // Check if the key is not already held down to avoid starting multiple intervals for the same key
    if (!pIsHeld) {
      pIsHeld = true;
      pIntervalId = setInterval(pRepeatedAction, 50); // Adjust the interval time (in milliseconds) as per your requirement
    }
  }
  if (event.key === "i") {
    // Check if the key is not already held down to avoid starting multiple intervals for the same key
    if (!iIsHeld) {
      iIsHeld = true;
      iIntervalId = setInterval(iRepeatedAction, 50); // Adjust the interval time (in milliseconds) as per your requirement
    }
  }
});

// Event listener for keyup event
document.addEventListener("keyup", function(event) {
  // Check if the released key is the one you are tracking (e.g., "m")
  if (event.key === "m") {
    clearInterval(mIntervalId);
    mIsHeld = false;
  }
  if (event.key === "p") {
    clearInterval(pIntervalId);
    pIsHeld = false;
  }
  if (event.key === "i") {
    clearInterval(iIntervalId);
    iIsHeld = false;
  }
});
