---
title: "Polices système — Pourquoi nous ne chargeons pas de polices personnalisées"
date: 2026-06-15
description: "Le cas pour system-ui : pourquoi vishpala.com utilise la pile de polices native de l'appareil plutôt que de charger des polices externes, et ce que cela signifie pour l'accessibilité, la performance et la souveraineté."
draft: false
params:
  status: "Stable"
  version: "1.0.0"
---

## La décision

Ce site utilise `system-ui, -apple-system, sans-serif` — la pile de polices native de l'appareil — pour tout le texte. Nous ne chargeons pas Google Fonts, des polices personnalisées auto-hébergées, ni aucun fichier de police externe.

Il s'agit d'une décision délibérée prise sur la base de l'accessibilité, de la performance et de la souveraineté.

## Accessibilité

Les polices système sont les polices que les fournisseurs de systèmes d'exploitation ont le plus optimisées pour la lisibilité à l'écran, à toutes les tailles, toutes les densités d'affichage et tous les paramètres d'accessibilité. San Francisco sur macOS et iOS, Segoe UI sur Windows et Roboto sur Android sont chacune le produit d'un investissement significatif.

De manière cruciale, les polices système répondent correctement aux préférences de police de l'utilisateur. Si un utilisateur a configuré son système d'exploitation pour utiliser une taille de police plus grande, ou une police spécifique pour des raisons de lisibilité, `system-ui` hérite de ces préférences. Une police web personnalisée les remplace — ce qui constitue un obstacle pour les utilisateurs qui dépendent de ces préférences.

Le Centre de recherche sur la conception inclusive de l'Université OCAD, dont les travaux façonnent directement notre pratique en matière d'accessibilité, utilise cette approche.

## Performance

Chaque fichier de police personnalisée est une requête réseau. Avec `system-ui`, le texte s'affiche immédiatement en utilisant une police déjà présente sur l'appareil. Il n'y a pas de texte invisible, pas de décalage de mise en page, et aucune dépendance à un réseau de diffusion de polices.

## Souveraineté

Charger des polices depuis Google Fonts établit une connexion aux serveurs de Google à chaque chargement de page, divulguant l'adresse IP du visiteur. `system-ui` n'introduit aucune dépendance externe d'aucune sorte et n'impose aucune charge de maintenance infrastructurelle.

## Compromis

Le compromis est la cohérence visuelle entre les plateformes. Une page s'affiche en San Francisco sur macOS et en Segoe UI sur Windows. Nous acceptons ce compromis car les avantages en matière d'accessibilité et de souveraineté l'emportent sur la valeur d'un rendu identique entre les appareils — particulièrement pour un studio dont la pratique est fondée sur les principes de conception inclusive.
