[CmdletBinding()]
param(
    [string]$CampaignPath
)

$ErrorActionPreference = 'Stop'
if (-not $CampaignPath) {
    $CampaignPath = Join-Path $PSScriptRoot '..\campaigns\alexandria-property-cleanout'
}
$campaign = (Resolve-Path -LiteralPath $CampaignPath).Path
$source = Join-Path $campaign 'source'
$font = 'C\:/Windows/Fonts/arialbd.ttf'
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source

function Invoke-Ffmpeg {
    param([string[]]$Arguments)
    & $ffmpeg @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "ffmpeg failed with exit code $LASTEXITCODE"
    }
}

function New-Comparison {
    param(
        [string]$Before,
        [string]$After,
        [string]$Output,
        [ValidateSet('portrait','landscape')][string]$Layout,
        [switch]$PrivacyCrop
    )

    $outputDir = Split-Path -Parent $Output
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

    if ($Layout -eq 'landscape') {
        if ($PrivacyCrop) {
            $panelFilter = 'scale=750:1000,eq=contrast=1.03:brightness=0.01,crop=600:900:0:50'
        }
        else {
            $panelFilter = 'scale=675:900,eq=contrast=1.03:brightness=0.01,crop=600:900:37:0'
        }
        $filter = "[0:v]$panelFilter,drawbox=x=24:y=24:w=164:h=52:color=black@0.72:t=fill,drawtext=fontfile='$font':text='BEFORE':fontcolor=white:fontsize=27:x=45:y=37[b];[1:v]$panelFilter,drawbox=x=24:y=24:w=144:h=52:color=0x1F7A3D@0.88:t=fill,drawtext=fontfile='$font':text='AFTER':fontcolor=white:fontsize=27:x=46:y=37[a];[b][a]hstack=inputs=2[stack];[stack]drawbox=x=0:y=840:w=1200:h=60:color=0x173E2A@0.94:t=fill,drawtext=fontfile='$font':text='CLEAR PATH JUNK REMOVAL  |  ALEXANDRIA, LA':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=858[out]"
    }
    else {
        $filter = "[0:v]scale=1080:1440,eq=contrast=1.03:brightness=0.01,crop=1080:676:0:382,drawbox=x=28:y=28:w=174:h=54:color=black@0.72:t=fill,drawtext=fontfile='$font':text='BEFORE':fontcolor=white:fontsize=29:x=51:y=41[b];[1:v]scale=1080:1440,eq=contrast=1.03:brightness=0.01,crop=1080:676:0:382,drawbox=x=28:y=28:w=151:h=54:color=0x1F7A3D@0.88:t=fill,drawtext=fontfile='$font':text='AFTER':fontcolor=white:fontsize=29:x=51:y=41[a];[b][a]vstack=inputs=2[stack];[stack]crop=1080:1350:0:0,drawbox=x=0:y=1290:w=1080:h=60:color=0x173E2A@0.94:t=fill,drawtext=fontfile='$font':text='CLEAR PATH JUNK REMOVAL  |  ALEXANDRIA, LA':fontcolor=white:fontsize=23:x=(w-text_w)/2:y=1308[out]"
    }

    Invoke-Ffmpeg -Arguments @('-hide_banner','-loglevel','error','-y','-i',$Before,'-i',$After,'-filter_complex',$filter,'-map','[out]','-frames:v','1','-c:v','libwebp','-quality','84',$Output)
}

function New-PinterestComparison {
    param([string]$Before,[string]$After,[string]$Output)
    New-Item -ItemType Directory -Path (Split-Path -Parent $Output) -Force | Out-Null
    $filter = "[0:v]scale=1000:1333,eq=contrast=1.03:brightness=0.01,crop=1000:750:0:291,drawbox=x=26:y=26:w=166:h=52:color=black@0.72:t=fill,drawtext=fontfile='$font':text='BEFORE':fontcolor=white:fontsize=27:x=47:y=39[b];[1:v]scale=1000:1333,eq=contrast=1.03:brightness=0.01,crop=1000:750:0:291,drawbox=x=26:y=26:w=144:h=52:color=0x1F7A3D@0.88:t=fill,drawtext=fontfile='$font':text='AFTER':fontcolor=white:fontsize=27:x=48:y=39[a];[b][a]vstack=inputs=2[stack];[stack]drawbox=x=0:y=1440:w=1000:h=60:color=0x173E2A@0.94:t=fill,drawtext=fontfile='$font':text='CLEAR PATH JUNK REMOVAL  |  ALEXANDRIA, LA':fontcolor=white:fontsize=21:x=(w-text_w)/2:y=1458[out]"
    Invoke-Ffmpeg -Arguments @('-hide_banner','-loglevel','error','-y','-i',$Before,'-i',$After,'-filter_complex',$filter,'-map','[out]','-frames:v','1','-c:v','libwebp','-quality','84',$Output)
}

function New-Standalone {
    param([string]$SourceImage,[string]$Output)
    New-Item -ItemType Directory -Path (Split-Path -Parent $Output) -Force | Out-Null
    Invoke-Ffmpeg -Arguments @('-hide_banner','-loglevel','error','-y','-i',$SourceImage,'-vf','scale=1080:1440,eq=contrast=1.03:brightness=0.01,crop=1080:1350:0:45','-frames:v','1','-c:v','libwebp','-quality','84',$Output)
}

$pairs = @{
    hero = @('cook-ave-kitchen-entry-before.webp','cook-ave-kitchen-entry-after.webp')
    living = @('cook-ave-living-room-before.webp','cook-ave-living-room-after.webp')
    kitchenWide = @('cook-ave-kitchen-wide-before.webp','cook-ave-kitchen-wide-after.webp')
    secondRoom = @('cook-ave-second-room-before.webp','cook-ave-second-room-after.webp')
    porch = @('cook-ave-porch-before.webp','cook-ave-porch-after.webp')
}

foreach ($pair in $pairs.Values) {
    foreach ($name in $pair) {
        if (-not (Test-Path -LiteralPath (Join-Path $source $name))) {
            throw "Missing required source image: $name"
        }
    }
}

$heroBefore = Join-Path $source $pairs.hero[0]
$heroAfter = Join-Path $source $pairs.hero[1]
$livingBefore = Join-Path $source $pairs.living[0]
$livingAfter = Join-Path $source $pairs.living[1]
$wideBefore = Join-Path $source $pairs.kitchenWide[0]
$wideAfter = Join-Path $source $pairs.kitchenWide[1]
$secondBefore = Join-Path $source $pairs.secondRoom[0]
$secondAfter = Join-Path $source $pairs.secondRoom[1]
$porchBefore = Join-Path $source $pairs.porch[0]
$porchAfter = Join-Path $source $pairs.porch[1]

New-Standalone $heroBefore (Join-Path $campaign 'processed\alexandria-kitchen-cleanout-before.webp')
New-Standalone $heroAfter (Join-Path $campaign 'processed\alexandria-kitchen-cleanout-after.webp')
New-Standalone $livingAfter (Join-Path $campaign 'processed\alexandria-living-room-cleared.webp')
New-Comparison $heroBefore $heroAfter (Join-Path $campaign 'processed\alexandria-kitchen-cleanout-before-after.webp') 'landscape'
New-Comparison $livingBefore $livingAfter (Join-Path $campaign 'processed\alexandria-living-room-cleanout-before-after.webp') 'landscape'
New-Comparison $wideBefore $wideAfter (Join-Path $campaign 'processed\alexandria-kitchen-wide-cleanout-before-after.webp') 'landscape'
New-Comparison $secondBefore $secondAfter (Join-Path $campaign 'processed\alexandria-second-room-cleanout-before-after.webp') 'landscape'
New-Comparison $porchBefore $porchAfter (Join-Path $campaign 'processed\alexandria-covered-porch-cleanout-before-after.webp') 'landscape' -PrivacyCrop

New-Comparison $heroBefore $heroAfter (Join-Path $campaign 'facebook\alexandria-kitchen-cleanout-before-after-facebook.webp') 'portrait'
New-Comparison $livingBefore $livingAfter (Join-Path $campaign 'facebook\alexandria-living-room-cleanout-before-after-facebook.webp') 'portrait'
New-Standalone $livingAfter (Join-Path $campaign 'facebook\alexandria-property-cleanout-photo-estimate-facebook.webp')
New-Comparison $heroBefore $heroAfter (Join-Path $campaign 'instagram\alexandria-kitchen-cleanout-before-after-instagram.webp') 'portrait'
New-Comparison $wideBefore $wideAfter (Join-Path $campaign 'instagram\alexandria-kitchen-wide-cleanout-before-after-instagram.webp') 'portrait'
New-Comparison $livingBefore $livingAfter (Join-Path $campaign 'instagram\alexandria-living-room-cleanout-before-after-instagram.webp') 'portrait'
New-Comparison $heroBefore $heroAfter (Join-Path $campaign 'nextdoor\alexandria-kitchen-cleanout-before-after-nextdoor.webp') 'landscape'
New-Comparison $secondBefore $secondAfter (Join-Path $campaign 'nextdoor\alexandria-second-room-cleanout-before-after-nextdoor.webp') 'landscape'
New-Comparison $heroBefore $heroAfter (Join-Path $campaign 'google-business\alexandria-kitchen-cleanout-before-after-google-business.webp') 'landscape'
New-Comparison $porchBefore $porchAfter (Join-Path $campaign 'google-business\alexandria-covered-porch-cleanout-before-after-google-business.webp') 'landscape' -PrivacyCrop
New-PinterestComparison $heroBefore $heroAfter (Join-Path $campaign 'pinterest\alexandria-kitchen-cleanout-before-after-pinterest.webp')
New-PinterestComparison $livingBefore $livingAfter (Join-Path $campaign 'pinterest\alexandria-property-cleanout-before-after-pinterest.webp')

Write-Output "Built campaign assets in $campaign"
