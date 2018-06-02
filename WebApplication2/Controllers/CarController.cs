using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    public class CarController : Controller
    {
        // GET: Car
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult getCar()
        {
            int totalCount;
            it_datian_hkEntities1 testEntity = new it_datian_hkEntities1();
            var clist = testEntity.tmsmacar_model.ToList();
            totalCount = clist.Count();
            return Json(new { total = totalCount, rows = clist });
        }

        public ActionResult SaveCar(HttpContext context)
        {
            HttpRequest request = context.Request;
            
            return Content("OK");
        }
    }
}