<?php

use App\Models\NewCOC;

it('generates a tracker id with R00 prefix when no region is given', function () {
    $id = NewCOC::generateTrackerID();
    expect($id)->toStartWith('R00-');
    expect($id)->toMatch('/^R00-[A-Za-z0-9!@#$%&*\^]{7}$/');
});

it('uses NCR abbreviation for NCR region', function () {
    $region = 'NCR - National Capital Region';
    $id = NewCOC::generateTrackerID($region);

    expect($id)->toStartWith('NCR-');
    expect($id)->toMatch('/^NCR-[A-Za-z0-9!@#$%&*\^]{7}$/');
});

it('uses R01 for Region I', function () {
    $region = 'Region I - Ilocos Region';
    $id = NewCOC::generateTrackerID($region);

    expect($id)->toStartWith('R01-');
    expect($id)->toMatch('/^R01-[A-Za-z0-9!@#$%&*\^]{7}$/');
});

it('uses R04 for Region IV-A', function () {
    $region = 'Region IV-A - CALABARZON';
    $id = NewCOC::generateTrackerID($region);

    expect($id)->toStartWith('R04-');
});

it('uses BARMM abbreviation when region is BARMM', function () {
    $region = 'BARMM';
    $id = NewCOC::generateTrackerID($region);

    expect($id)->toStartWith('BARMM-');
    expect($id)->toMatch('/^BARMM-[A-Za-z0-9!@#$%&*\^]{7}$/');
});

it('uses CAR abbreviation when region is CAR', function () {
    $region = 'CAR - Cordillera Administrative Region';
    $id = NewCOC::generateTrackerID($region);

    expect($id)->toStartWith('CAR-');
    expect($id)->toMatch('/^CAR-[A-Za-z0-9!@#$%&*\^]{7}$/');
});

it('uses R02 when region name is Cagayan Valley', function () {
    $id = NewCOC::generateTrackerID('Cagayan Valley');

    expect($id)->toStartWith('R02-');
    expect($id)->toMatch('/^R02-[A-Za-z0-9!@#$%&*\^]{7}$/');
});

it('uses R02 when region is roman numeral II', function () {
    $id = NewCOC::generateTrackerID('II');

    expect($id)->toStartWith('R02-');
});

it('uses R02 when region is numeric 02', function () {
    $id = NewCOC::generateTrackerID('02');

    expect($id)->toStartWith('R02-');
});
