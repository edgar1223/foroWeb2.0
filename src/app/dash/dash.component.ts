import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { Materia } from '../models/materia/materia';
import { PostService } from "../services/post-service.service";
import { Router } from '@angular/router';
import * as stringSimilarity from 'string-similarity';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  constructor(private postService: PostService, private router: Router, private sanitizer: DomSanitizer) {}

  carouselImages = [
    { url: 'https://via.placeholder.com/800x400', title: 'First Slide', description: 'This is the first slide description.' },
    { url: 'https://via.placeholder.com/800x400', title: 'Second Slide', description: 'This is the second slide description.' },
    { url: 'https://via.placeholder.com/800x400', title: 'Third Slide', description: 'This is the third slide description.' }
  ];

  posts: Post[] = [];
  filteredPosts: Post[] = [];
  materias: Materia[] = [];
  currentPage = 1;
  postsPerPage = 5;
  totalPages!: number;
  paginatedPosts: Post[] = [];

  materiasCurrentPage = 1;
  materiasPerPage = 7;
  materiasTotalPages!: number;
  paginatedMaterias: Materia[] = [];
  searchQuery: string = '';

  ngOnInit(): void {
    this.getPostAll();
    this.postService.searchMateria().subscribe(
      response => {
        this.materias = response;
        this.materiasTotalPages = Math.ceil(this.materias.length / this.materiasPerPage);
        this.updatePaginatedMaterias();
      },
      error => {
        console.error('Error searching posts', error);
      }
    );
  }

  getPostAll(): void {
    this.postService.getPostAll().subscribe(
      response => {
        this.posts = response;
        this.filteredPosts = this.posts;
        this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        this.updatePaginatedPosts();
      },
      error => {
        console.error('Error fetching posts', error);
      }
    );
  }

  updatePaginatedPosts(): void {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  updatePaginatedMaterias(): void {
    const startIndex = (this.materiasCurrentPage - 1) * this.materiasPerPage;
    const endIndex = startIndex + this.materiasPerPage;
    this.paginatedMaterias = this.materias.slice(startIndex, endIndex);
  }

  searchPosts(): void {
    if (this.searchQuery) {
      const lowerSearchQuery = this.searchQuery.toLowerCase();
      this.filteredPosts = this.posts.filter(post => {
        const lowerTitle = post.titulo.toLowerCase();
        const lowerContent = post.contenido.toLowerCase();
        return lowerTitle.includes(lowerSearchQuery) || lowerContent.includes(lowerSearchQuery);
      });
    } else {
      this.filteredPosts = this.posts;
    }
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    this.currentPage = 1;
    this.updatePaginatedPosts();
  }
  

  previousPostsPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  nextPostsPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  goToPostsPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPosts();
  }

  previousMateriasPage(): void {
    if (this.materiasCurrentPage > 1) {
      this.materiasCurrentPage--;
      this.updatePaginatedMaterias();
    }
  }

  nextMateriasPage(): void {
    if (this.materiasCurrentPage < this.materiasTotalPages) {
      this.materiasCurrentPage++;
      this.updatePaginatedMaterias();
    }
  }

  goToMateriasPage(page: number): void {
    this.materiasCurrentPage = page;
    this.updatePaginatedMaterias();
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1).slice(this.getPaginationStartIndex(), this.getPaginationEndIndex());
  }

  getPaginationStartIndex(): number {
    if (this.currentPage <= 3) {
      return 0;
    } else if (this.currentPage >= this.totalPages - 2) {
      return this.totalPages - 5;
    } else {
      return this.currentPage - 3;
    }
  }

  getPaginationEndIndex(): number {
    if (this.currentPage <= 3) {
      return 5;
    } else if (this.currentPage >= this.totalPages - 2) {
      return this.totalPages;
    } else {
      return this.currentPage + 2;
    }
  }

  get materiasTotalPagesArray(): number[] {
    return Array(this.materiasTotalPages).fill(0).map((x, i) => i + 1).slice(this.getMateriasPaginationStartIndex(), this.getMateriasPaginationEndIndex());
  }

  getMateriasPaginationStartIndex(): number {
    if (this.materiasCurrentPage <= 3) {
      return 0;
    } else if (this.materiasCurrentPage >= this.materiasTotalPages - 2) {
      return this.materiasTotalPages - 5;
    } else {
      return this.materiasCurrentPage - 3;
    }
  }

  getMateriasPaginationEndIndex(): number {
    if (this.materiasCurrentPage <= 3) {
      return 5;
    } else if (this.materiasCurrentPage >= this.materiasTotalPages - 2) {
      return this.materiasTotalPages;
    } else {
      return this.materiasCurrentPage + 2;
    }
  }

  openPost(postId?: number): void {
    console.log(postId);
    if (postId !== undefined && postId !== null) {
      this.router.navigate(['/post', postId]);
    } else {
      console.error('postId is undefined or null');
    }
  }
  resetPosts(): void {
    this.searchQuery = '';
    this.filteredPosts = this.posts;
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    this.currentPage = 1;
    this.updatePaginatedPosts();
  }
  
  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  extractFirstP(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    const p = div.querySelector('p');
    if (p) {
      const text = p.textContent || '';
      return this.truncateText(text, 25); // Truncar al 25%
    }
    return '';
  }

  truncateText(text: string, percentage: number): string {
    const length = Math.floor(text.length * (percentage / 100));
    return text.substring(0, length) + (text.length > length ? '...' : '');
  }
}
