<?php
require('../lib/DynApi.php');
class Api extends CI_Controller {
	use DynApi;

	public function __construct(){
		parent::__construct();
	}

	/** returns the list of 10 "values"
	* @return array
	*/
	public function getList($value){
		$this->output(array_fill(0, 10, $value));
	}
	
	/** returns an object {key:value}*/
	public function getObject($key,$value){
		$this->output(array($key=>$value));
	}

	/** returns the posted Data
	* @return object
	*/
	public function postData($id){
		$this->output($this->input);
	}

}
?>