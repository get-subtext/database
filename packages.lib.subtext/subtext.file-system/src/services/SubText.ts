import type * as T from '@get-subtext/lib.subtext';
import fs from 'fs';
import { filter, map } from 'lodash-es';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

export class SubText implements T.SubText {
  public constructor(private readonly rootDir: string) {}

  public async getAllMovieIds() {
    const movieRootDir = this.getMovieRootDir();
    this.ensureDir(movieRootDir);
    const entries = await fs.promises.readdir(movieRootDir, { withFileTypes: true });
    const directories = filter(entries, (e) => e.isDirectory());
    const movieIds = map(directories, (d) => d.name);
    return movieIds;
  }

  public async getMovieData(imdbId: string) {
    const filePath = this.getMovieIndexFilePath(imdbId);
    this.ensureDirForFile(filePath);
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : null;
    return data;
  }

  public async writeRequestIndex(request: T.Request) {
    const filePath = this.getRequestIndexFilePath(request.requestId);
    this.ensureDirForFile(filePath);
    await this.writeJsonFile(filePath, request);
    return filePath;
  }

  public async writeQueryIndex(data: T.WriteIndexDataInputMovie, userId: string, timestamp: string) {
    const filePath = this.getMovieQueryIndexFile(data.pageNumber);
    this.ensureDirForFile(filePath);
    await this.writeJsonFile(filePath, data);
    return filePath;
  }

  public async writeMovieIndex(data: T.StMovieIndex) {
    const filePath = this.getMovieIndexFilePath(data.imdbId);
    this.ensureDirForFile(filePath);
    await this.writeJsonFile(filePath, data);
    return filePath;
  }

  public async writePosterIndex({ imdbId, ...poster }: T.StPosterIndex) {
    const filePath = this.getPosterIndexFilePath(imdbId, poster.posterId);
    this.ensureDirForFile(filePath);
    await this.writeJsonFile(filePath, poster);
    return filePath;
  }

  public async writePosterImage(poster: T.StPosterImage) {
    const filePath = this.getPosterImageFilePath(poster.imdbId, poster.posterId, poster.fileName);
    this.ensureDirForFile(filePath);
    await this.writeImageFile(filePath, poster.url);
    return filePath;
  }

  public async writeSubtitleFileIndex({ imdbId, ...subtitleFile }: T.StSubtitleFileIndex) {
    const filePath = this.getSubtitleFileIndexFilePath(imdbId, subtitleFile.subtitleFileId);
    this.ensureDirForFile(filePath);
    await this.writeJsonFile(filePath, subtitleFile);
    return filePath;
  }

  public async deleteAllQueries() {
    const queryRootDir = this.getQueryRootDir();
    this.ensureDir(queryRootDir);
    await fs.promises.rm(queryRootDir, { recursive: true, force: true });
  }

  private getQueryRootDir() {
    const filePath = path.resolve(this.rootDir, 'queries');
    return filePath;
  }

  private getMovieQueryRootDir() {
    const queryRootDir = this.getQueryRootDir();
    const movieQueryRootDir = path.resolve(queryRootDir, 'release-date-asc');
    return movieQueryRootDir;
  }

  private getMovieQueryIndexDir(pageNumber: number) {
    const movieQueryRootDir = this.getMovieQueryRootDir();
    const movieQueryIndexDir = path.resolve(movieQueryRootDir, pageNumber.toString());
    return movieQueryIndexDir;
  }

  private getMovieQueryIndexFile(pageNumber: number) {
    const movieQueryIndexDir = this.getMovieQueryIndexDir(pageNumber);
    const movieQueryIndexFile = path.resolve(movieQueryIndexDir, 'index.json');
    return movieQueryIndexFile;
  }

  private getRequestRootDir() {
    const requestRootDir = path.resolve(this.rootDir, 'requests');
    return requestRootDir;
  }

  private getRequestIndexDir(requestId: string) {
    const requestRootDir = this.getRequestRootDir();
    const requestIndexDir = path.resolve(requestRootDir, requestId);
    return requestIndexDir;
  }

  private getRequestIndexFilePath(imdbId: string) {
    const requestIndexDir = this.getRequestIndexDir(imdbId);
    const filePath = path.resolve(requestIndexDir, 'index.json');
    return filePath;
  }

  private getMovieRootDir() {
    const movieRootDir = path.resolve(this.rootDir, 'movies');
    return movieRootDir;
  }

  private getMovieIndexDir(imdbId: string) {
    const movieRootDir = this.getMovieRootDir();
    const movieItemDir = path.resolve(movieRootDir, imdbId);
    return movieItemDir;
  }

  private getMovieIndexFilePath(imdbId: string) {
    const movieIndexDir = this.getMovieIndexDir(imdbId);
    const filePath = path.resolve(movieIndexDir, 'index.json');
    return filePath;
  }

  private getPosterRootDir(imdbId: string) {
    const movieIndexDir = this.getMovieIndexDir(imdbId);
    const filePath = path.resolve(movieIndexDir, 'posters');
    return filePath;
  }

  private getPosterIndexDir(imdbId: string, posterId: string) {
    const posterRootDir = this.getPosterRootDir(imdbId);
    const filePath = path.resolve(posterRootDir, posterId);
    return filePath;
  }

  private getPosterIndexFilePath(imdbId: string, posterId: string) {
    const posterIndexDir = this.getPosterIndexDir(imdbId, posterId);
    const filePath = path.resolve(posterIndexDir, 'index.json');
    return filePath;
  }

  private getPosterImageFilePath(imdbId: string, posterId: string, fileName: string) {
    const posterIndexDir = this.getPosterIndexDir(imdbId, posterId);
    const filePath = path.resolve(posterIndexDir, fileName);
    return filePath;
  }

  private getSubtitleFileRootDir(imdbId: string) {
    const movieIndexDir = this.getMovieIndexDir(imdbId);
    const subtitleFileRootDir = path.resolve(movieIndexDir, 'subtitle-files');
    return subtitleFileRootDir;
  }

  private getSubtitleFileIndexDir(imdbId: string, subtitleFileId: string) {
    const subtitleFileRootDir = this.getSubtitleFileRootDir(imdbId);
    const subtitleFileIndexDir = path.resolve(subtitleFileRootDir, subtitleFileId);
    return subtitleFileIndexDir;
  }

  private getSubtitleFileIndexFilePath(imdbId: string, subtitleFileId: string) {
    const subtitleFileIndexDir = this.getSubtitleFileIndexDir(imdbId, subtitleFileId);
    const subtitleFileIndexFilePath = path.resolve(subtitleFileIndexDir, 'index.json');
    return subtitleFileIndexFilePath;
  }

  private async writeJsonFile(filePath: string, fileContent: any) {
    this.ensureDirForFile(filePath);
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  }

  private async writeImageFile(filePath: string, url: string) {
    this.ensureDirForFile(filePath);
    const response = await fetch(url);
    const fileStream = fs.createWriteStream(filePath);
    await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
  }

  private ensureDirForFile(filePath: string) {
    this.ensureDir(path.resolve(filePath, '..'));
  }

  private ensureDir(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
