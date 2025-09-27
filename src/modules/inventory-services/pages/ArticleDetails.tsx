import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Package, Wrench, MapPin, Clock, DollarSign, User, Calendar, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getStatusColor, getStatusIcon, getTypeIcon, getLocationIcon } from "../components/utils";
import { ArticlesService, type InventoryArticle } from "@/modules/articles/services/articles.service";

// Convert InventoryArticle to Article format for compatibility
const convertToArticleFormat = (article: InventoryArticle) => ({
  id: article.id,
  type: 'material' as const,
  name: article.name,
  sku: article.sku,
  category: article.category,
  stock: article.stock,
  minStock: article.minStock,
  costPrice: article.price,
  sellPrice: article.sellPrice,
  supplier: article.supplier,
  location: article.location || "Warehouse A",
  subLocation: undefined,
  basePrice: undefined,
  duration: undefined,
  skillsRequired: undefined,
  materialsNeeded: [],
  preferredUsers: [],
  lastUsed: article.lastUsed ? new Date(article.lastUsed) : undefined,
  lastUsedBy: article.lastUsedBy,
  tags: [],
  notes: article.description,
  status: article.status as any,
  description: article.description,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "system",
  modifiedBy: "system"
});

export function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const rawArticle = ArticlesService.getById(id || '');
  const article = rawArticle ? convertToArticleFormat(rawArticle) : undefined;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('Copied to clipboard', { item: label }));
  };
  
  if (!article) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('Article not found')}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/inventory-services')}>
              {t('Back to Articles')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(article.status);
  const TypeIcon = getTypeIcon(article.type);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/inventory-services')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back')}
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                <TypeIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{article.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="capitalize">
                  {t(article.type)}
                </Badge>
                <Badge className={getStatusColor(article.status)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {t(article.status?.replace("_", " "))}
                </Badge>
                {article.type === 'material' && (article as any).stock <= (article as any).minStock && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {t('Low Stock')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {article.sku && (
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(article.sku!, 'SKU')}>
              <Copy className="h-4 w-4 mr-2" />
              {t('Copy SKU')}
            </Button>
          )}
          <Button onClick={() => navigate(`/dashboard/inventory-services/article/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            {t('Edit')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('General Information')}</CardTitle>
              <CardDescription>{t('Basic details and description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.sku && (
                <div className="flex items-center justify-between">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('SKU')}</dt>
                    <dd className="text-sm font-mono">{article.sku}</dd>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(article.sku!, 'SKU')}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('Category')}</dt>
                <dd className="text-sm">{article.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('Description')}</dt>
                <dd className="text-sm leading-relaxed">{article.description}</dd>
              </div>
              {article.notes && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">{t('Notes')}</dt>
                  <dd className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{article.notes}</dd>
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">{t('Tags')}</dt>
                  <dd className="flex gap-1 flex-wrap mt-1">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Type-specific Details */}
          {article.type === 'material' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t('Inventory Details')}
                </CardTitle>
                <CardDescription>{t('Stock levels and pricing information')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <dt className="text-sm font-medium text-muted-foreground">{t('Current Stock')}</dt>
                    <dd className={`text-lg font-semibold ${(article as any).stock <= (article as any).minStock ? 'text-destructive' : 'text-foreground'}`}>
                      {(article as any).stock} {t('units')}
                    </dd>
                    {(article as any).stock <= (article as any).minStock && (
                      <p className="text-xs text-destructive mt-1">{t('Below minimum stock')}</p>
                    )}
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <dt className="text-sm font-medium text-muted-foreground">{t('Minimum Stock')}</dt>
                    <dd className="text-lg font-semibold">{(article as any).minStock} {t('units')}</dd>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('Cost Price')}</dt>
                    <dd className="text-sm">{(article as any).costPrice} TND</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('Sell Price')}</dt>
                    <dd className="text-lg font-semibold text-primary">{(article as any).sellPrice} TND</dd>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">
                      <span className="font-medium">{t('Location')}:</span> {(article as any).location}
                      {(article as any).subLocation && ` - ${(article as any).subLocation}`}
                    </span>
                  </div>
                  {(article as any).supplier && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">
                        <span className="font-medium">{t('Supplier')}:</span> {(article as any).supplier}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {t('Service Details')}
                </CardTitle>
                <CardDescription>{t('Pricing and requirements information')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <dt className="text-sm font-medium text-muted-foreground">{t('Base Price')}</dt>
                    <dd className="text-lg font-semibold text-primary">{(article as any).basePrice} TND</dd>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <dt className="text-sm font-medium text-muted-foreground">{t('Duration')}</dt>
                    <dd className="text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {(article as any).duration} {t('minutes')}
                    </dd>
                  </div>
                </div>
                {(article as any).skillsRequired && (article as any).skillsRequired.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-2">{t('Skills Required')}</dt>
                    <dd className="flex gap-1 flex-wrap">
                      {(article as any).skillsRequired.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
                {(article as any).materialsNeeded && (article as any).materialsNeeded.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-2">{t('Materials Needed')}</dt>
                    <dd className="flex gap-1 flex-wrap">
                      {(article as any).materialsNeeded.map((material: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
                {(article as any).preferredUsers && (article as any).preferredUsers.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-2">{t('Preferred Users')}</dt>
                    <dd className="flex gap-1 flex-wrap">
                      {(article as any).preferredUsers.map((user: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {user}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Info */}
          {article.type === 'material' && (article as any).lastUsed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('Usage Information')}
                </CardTitle>
                <CardDescription>{t('Recent usage history')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <dt className="text-sm font-medium text-muted-foreground">{t('Last Used')}</dt>
                  <dd className="text-sm font-medium">{(article as any).lastUsed.toLocaleDateString()}</dd>
                </div>
                {(article as any).lastUsedBy && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <dt className="text-sm font-medium text-muted-foreground">{t('Used By')}</dt>
                    <dd className="text-sm font-medium">{(article as any).lastUsedBy}</dd>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('Audit Trail')}
              </CardTitle>
              <CardDescription>{t('Creation and modification history')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <dt className="text-sm font-medium text-muted-foreground">{t('Created')}</dt>
                <dd className="text-sm font-medium">{article.createdAt.toLocaleDateString()}</dd>
                <dd className="text-xs text-muted-foreground">{t('By')}: {article.createdBy}</dd>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <dt className="text-sm font-medium text-muted-foreground">{t('Last Modified')}</dt>
                <dd className="text-sm font-medium">{article.updatedAt.toLocaleDateString()}</dd>
                <dd className="text-xs text-muted-foreground">{t('By')}: {article.modifiedBy}</dd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}