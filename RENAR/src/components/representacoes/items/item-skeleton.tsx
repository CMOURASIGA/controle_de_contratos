import {
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  CardHeader,
} from "@cnc-ti/layout-basic";

export function ItemCarregando() {
  return (
    <Card className="pt-4">
      <CardHeader className="flex flex-col items-start">
        <div className="w-12 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
        <div className="w-full flex items-center justify-between">
          <div className="w-40 h-3 mt-2 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between pt-4">
        <div className="space-y-6">
          {/* Profissão */}
          <div>
            <div className="w-20 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Categoria */}
          <div>
            <div className="w-24 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="w-24 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div>
              <div className="w-24 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <CardFooterItem>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </CardFooterItem>
        <CardFooterItem>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </CardFooterItem>
      </CardFooter>
    </Card>
  );
}
