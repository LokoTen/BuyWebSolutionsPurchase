using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace BuyWebSolutionsPurchase.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SendRequest(string address, DateTime date) {
            //Записываем в текстовый файл данные
            using (var txt = new StreamWriter("delivery.txt", true))
            {
                txt.WriteLine(string.Format("{0} {1}", address, date));
            }

            return Json("Запрос отправлен");
        }
    }
}
