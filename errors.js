'use strict';
class GameError extends Error { constructor(message){super(message);this.name=this.constructor.name;} }
class InvalidSpeedError extends GameError {}
class OutOfBoundsError extends GameError {}
