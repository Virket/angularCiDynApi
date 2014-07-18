<?php
trait DynApi {
	public function describeApi(){
		$exclude =array('__construct','describeApi');

		$data=array('endpoints'=>array());
		$className = get_class($this);
		
		$proto = 'http://';
		// http://php.net/manual/en/reserved.variables.server.php
		if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' && $_SERVER['HTTPS'] != false )
			$proto = 'https://';
		$data['baseEndpoint'] = $proto.$_SERVER['SERVER_NAME'].'/'.$className;

		$className = get_class($this);
		$class = new ReflectionClass($className);
		$methods = $class->getMethods(ReflectionMethod::IS_PUBLIC);
		foreach ($methods as $method) {
			$methodName = $method->getName();
			if(($method->getDeclaringClass()->getName() != $className) || ( in_array($methodName, $exclude)) ){
				continue 1;
			}

			if(!array_key_exists($methodName, $data['endpoints'])){
				$data['endpoints'][$methodName]=array(
					'params'=>array(),
					'returns'=>'object',
					'method'=>'GET'
				);
			}

			preg_match('/^(get|post|put|delete).*/i',$methodName,$httpMethod);
			if(isset($httpMethod[1])){
				$data['endpoints'][$methodName]['method']=strtoupper($httpMethod[1]);
			}

			$params = $method->getParameters();
			foreach ($params as $param) {
    			array_push($data['endpoints'][$methodName]['params'], array($param->getName()=>!$param->isOptional()));
			}
			if($method->getDocComment()){
				$doc = str_replace('/**','',$method->getDocComment());
				$doc = str_replace('*/','',$doc);
				$doc = rtrim(trim($doc));
				$data['endpoints'][$methodName]['doc'] = $doc;
				preg_match('/.*(@return) ([a-zA-Z]*).*/', $doc,$ret);
				if(isset($ret[2])){
					$data['endpoints'][$methodName]['returns'] = $ret[2];
				}
			}
		}
		$this->output($data);
	}

	private function output($data){
		$json= json_encode($data);
		$this->output->set_content_type('application/json')->set_output($json);		
	}
}
?>