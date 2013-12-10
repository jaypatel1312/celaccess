<?php
	$xml=new DOMDocument('2.0');
	$xml->load("SampleParameters.xml");
	$xml->preserveWhiteSpace = false;
	$xml->formatOutput = true;
	$response = new stdClass();
	$root = $xml->documentElement;
function getElementByDayName( $oXML , $dayName = NULL )
{
	if( $dayName == NULL)
	{
		return false;
	}
	else
	{
		$aElems = $oXML->getElementsByTagName('Desc');
		foreach( $aElems as $Elem )
		{
			if( $Elem->nodeValue == $dayName)
			{
				return $Elem->parentNode;
			}
		}
		return false;
	}
}

function hasTimeBlock( $oxml , $element , $aData = array() )
{
	$day = $aData['day'];
	
	$timeblocks = $element->getElementsByTagName('TimeBlock');

	foreach( $timeblocks as $timeblock )
	{
		$start = $timeblock->getElementsByTagName('Start');
		if( $start->item(0)->nodeValue == $aData['hour'].$aData['minute'] )
		{
			return true;
		}
	}
	return false;
}

function hasWeekBlock( $oxml , $aWeek = array() )
{
	$day = $aWeek['day'];

	$dayblocks = $oxml->getElementsByTagName('DayRow');

	foreach( $dayblocks as $dayblock )
	{
		$weekName = $dayblock->getElementsByTagName('Desc');
		if( $weekName->item(0)->nodeValue == $day )
		{
			return true;
		}
	}
	return false;
}


function removeTimeBlock( $oxml , $elem , $aData = array() )
{
	$day = $aData['day'];
	$timeblocks = $elem->getElementsByTagName('TimeBlock');

	foreach( $timeblocks as $timeblock )
	{
		$start = $timeblock->getElementsByTagName('Start');
		if( $start->item(0)->nodeValue == $aData['hour'].$aData['minute'] )
		{
			$elem->removeChild( $timeblock );
			return true;
		}
	}
	return false;	
}

function getMaxTimeBlockItem( $oxml , $elem , $aData = array() )
{
	$timeblocks = $elem->getElementsByTagName('TimeBlock');
	return $timeblocks->length;
}

function getMaxWeekBlockItem( $oxml  , $aWeek = array() )
{
	$weekblocks = $oxml->getElementsByTagName('DayRow');
	return $weekblocks->length;
}

if( isset( $_POST['update'] ) )
{
	$_POST['color'] = '#00AA00';
	$elem = getElementByDayName( $xml , $_POST['day'] );
	
	if( ! hasWeekBlock( $xml , $_POST ) )
	{
		//get ID and Row
		$maxID = getMaxWeekBlockItem( $xml , $_POST );
		
		$newWeek = $xml->createElement('DayRow');
		
		$x = $xml->createElement('ID',$maxID + 1);
		$newWeek->appendChild($x);
		
		$x = $xml->createElement('Desc',$_POST['day']);
		$newWeek->appendChild($x);
		
		$x = $xml->createElement('DescColor','#006600');
		$newWeek->appendChild($x);
		
		$x = $xml->createElement('BGColor','#E0E000');
		$newWeek->appendChild($x);

		$newElem = $xml->createElement('TimeBlock');
		
		$x = $xml->createElement('ID',$maxID + 1);
		$newElem->appendChild($x);
		
		$x=$xml->createElement('Row' , intval($_POST['hour']));
		$newElem->appendChild($x);

		$x=$xml->createElement('Start',$_POST['hour'].$_POST['minute']);
		$newElem->appendChild($x);
		
		$EndMinute = intval( $_POST['minute'] ) + 5;
		$EndHour = $_POST['hour'];
		if( $EndMinute >= 60)
		{
			$EndMinute = $EndMinute % 60;
			$EndHour = intval($EndHour) + 1;
		}

		if( $EndMinute < 10 && strpos($EndMinute, '0') !== TRUE )
		{
			$EndMinute = (string)$EndMinute;
			$EndMinute = "0".$EndMinute;
		}

		$x=$xml->createElement('End' , $EndHour.$EndMinute );
		$newElem->appendChild($x);

		$x=$xml->createElement('Color' , $_POST['color'] );
		$newElem->appendChild($x);
		
		$newWeek->appendChild($newElem);
		
		$root->appendChild($newWeek);

		$response->success = true;
		echo json_encode($response);
	}
	else if( ! hasTimeBlock ( $xml , $elem , $_POST ) )
	{
		//get ID and Row
		$maxID = getMaxTimeBlockItem( $xml , $elem , $_POST );

		$newElem = $xml->createElement('TimeBlock');
		
		$x = $xml->createElement('ID',$maxID + 1);
		$newElem->appendChild($x);
		
		$x=$xml->createElement('Row' , intval($_POST['hour']));
		$newElem->appendChild($x);

		$x=$xml->createElement('Start',$_POST['hour'].$_POST['minute']);
		$newElem->appendChild($x);
		
		$EndMinute = intval( $_POST['minute'] ) + 5;
		$EndHour = $_POST['hour'];
		if( $EndMinute >= 60)
		{
			$EndMinute = $EndMinute % 60;
			$EndHour = intval($EndHour) + 1;
		}

		if( $EndMinute < 10 && strpos($EndMinute, '0') !== TRUE )
		{
			$EndMinute = (string)$EndMinute;
			$EndMinute = "0".$EndMinute;
		}

		$x=$xml->createElement('End' , $EndHour.$EndMinute );
		$newElem->appendChild($x);

		$x=$xml->createElement('Color' , $_POST['color'] );
		$newElem->appendChild($x);
		
		$elem->appendChild($newElem);

		$response->success = true;
		echo json_encode($response);
	}
	else
	{
		removeTimeBlock( $xml , $elem , $_POST );
		$response->remove = true;
		echo json_encode($response);
	}
	$xml->save('SampleParameters.xml');

}

if( isset($_POST['getSlot']))
{
	$elem = getElementByDayName( $xml , $_POST['day'] );

	$timeblocks = $elem->getElementsByTagName('TimeBlock');
	
	$data = array();

	foreach( $timeblocks as $timeblock )
	{
		$start = $timeblock->getElementsByTagName('Start');
		$data[] = $start->item(0)->nodeValue;	
	}

	echo json_encode($data);
}

?>