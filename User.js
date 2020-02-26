//Put your custom functions and variables in this file

g_browserLibrary = "Chrome";

if (!g_recording)
{
	TestInit = function()
	{
		Global.DoLoadObjects('%WORKDIR%/Objects.js');
		Navigator.EnsureVisibleVerticalAlignment = "center";
	}
}

/**
 * Launches Dynamics 365 for Sales in a browser. Dynamics365SalesUrl, UserName, Password must be set in Config.xlsx
 */
function CrmLaunchSales()
{
	var url = Global.GetProperty("Dynamics365SalesUrl", "", "%WORKDIR%\\Config.xlsx");
	var usr = Global.GetProperty("UserName", "", "%WORKDIR%\\Config.xlsx");
	var pwd = Global.GetProperty("Password", "", "%WORKDIR%\\Config.xlsx");
	LoginMicrosoftOnline(url, usr, pwd);
}

/**
 * Changes area in the left bottom corner of the dashboard.
 */
function CrmChangeArea(/**string*/ name)
{
	SeS('G_OpenAreaList').DoClick();
	var xpath = "//li[@role='menuitemcheckbox' and normalize-space(.)='" + name + "']";
	var obj = Navigator.Find(xpath);
	if (obj)	
    {
    	obj.object_name = name;
    	obj.DoClick();
	}
	else
	{
		Tester.Assert("Area element is not found: " + name, false);
	}
}

/**
 * Opens entity in the site map.
 */
function CrmOpenEntity(/**string*/ entity)
{
	var xpath = "//li[@aria-label='" + entity + "' and contains(@id,'sitemap-entity')]";
	var obj = Navigator.Find(xpath);
	if (obj)	
	{
		obj.object_name = entity;
		obj.DoEnsureVisible();
		obj.DoClick();
	}
	else
	{
		Tester.Assert("Entity element is not found: " + entity, false);
	}	
}

/**
 * Clicks button on a toolbar.
 */
function CrmClickButton(/**string*/ name)
{
	var xpath = "//button[@aria-label='" + name + "']";
	var obj = Navigator.Find(xpath);
	if (obj)	
	{
		obj.object_name = name;
		obj.DoClick();
	}
	else
	{
		Tester.Assert("Button element is not found: " + name, false);
	}
}

/** 
 * Selects tab on the page.
 */
function CrmSelectTab(/**string*/ name)
{
	var xpath = "//li[@role='tab' and @title='" + name + "']";
	var obj = Navigator.Find(xpath);
	if (obj)	
	{
		obj.object_name = name;
		obj.DoClick();
	}
	else
	{
		Tester.Assert("Tab element is not found: " + name, false);
	}
}

/**
 * Navigates to the specified URL and performs login at https://login.microsoftonline.com/
 * Opens a browser if necessary.
 * @param url
 * @param userName
 * @param password
 */
function LoginMicrosoftOnline(/**string*/ url, /**string*/ userName, /**string*/ password)
{
	var o = {
		"UseAnotherAccount": "//div[@id='otherTileText']",
		"UserName": "//input[@name='loginfmt']",
		"Sumbit": "//input[@type='submit']",
		"Password": "//input[@name='passwd' and @type='password']",
		"DontShowAgain": "//input[@name='DontShowAgain']",
		"No": "//input[@type='button' and @id='idBtn_Back']"
	};

	Navigator.Open(url);
	Navigator.SetPosition(0, 0);
	
	Tester.SuppressReport(true);

	try
	{
		if (Navigator.Find(o["UseAnotherAccount"]))
		{
			Navigator.Find(o["UseAnotherAccount"]).DoClick();	
		}
		
		Navigator.Find(o["UserName"]).DoSetText(userName);
		Navigator.Find(o["Sumbit"]).DoClick();
		Global.DoSleep(2000);
		Navigator.Find(o["Password"]).DoSetText(password);
		Navigator.Find(o["Sumbit"]).DoClick();
		Global.DoSleep(2000);
		
		if (Navigator.Find(o["DontShowAgain"]))
		{
			Navigator.Find(o["No"]).DoClick();	
		}
		
		Tester.SuppressReport(false);
		Tester.Message("Logged in as " + userName);
	}
	catch(e)
	{
		Tester.SuppressReport(false);	
		Tester.Message(e.message);
	}
}

function CrmSaveDom()
{
	var domTree = Navigator.GetDomTree();
	if (domTree)
	{
		Navigator.SaveDomToXml("dom.xml", domTree);
	}
	else
	{
		Tester.Message("Failed to get DOM tree");
	}
}